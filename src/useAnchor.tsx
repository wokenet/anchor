import { once } from 'events'
import { useEffect, useState } from 'react'
import {
  createClient,
  EventType,
  Room,
  MatrixEvent,
  MatrixClient,
  RoomMember,
} from 'matrix-js-sdk'
import { debounce } from 'lodash'

import { chatRoomId, matrixServer, matrixGuestServer } from '../constants.json'

export type AnchorActions = {
  register: (
    username: string,
    password: string,
    captchaToken: string,
  ) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  sendMessage: (body: string) => Promise<void>
  mxcURL: (
    mxcURL: string,
    width?: number,
    height?: number,
    resizeMethod?: 'crop' | 'scale',
    allowDirectLinks?: boolean,
  ) => string
}

type UserInfo = {
  userId: string
  isGuest: boolean
}

export type ViewData =
  | {
      kind: 'hls' | 'embed' | 'offline'
      title?: string
      url: string
      fill: boolean
    }
  | {
      kind: 'live'
      title?: string
      hls: string
      dash: string
    }

const AnchorViewEventType = 'net.woke.anchor.view' as EventType

const initialSyncLimit = 35

async function greedyLoadState<T>(
  isSynced: () => boolean,
  eventType: EventType,
  callback: (T) => void,
) {
  // Helper for greedily racing single state event fetches with client sync. No-ops if client syncs before fetch finishes, so we don't use stale results.
  try {
    const resp = await fetch(
      `${matrixServer}/_matrix/client/r0/rooms/${encodeURIComponent(
        chatRoomId,
      )}/state/${eventType}/`,
    )
    const data = await resp.json()

    // If the client has already synced, no-op.
    if (isSynced()) {
      return
    }

    callback(data)
  } catch (err) {
    console.warn('Error prefetching initial state:', eventType, err)
  }
}

function useAnchor() {
  let client: MatrixClient
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [room, setRoom] = useState<Room>()
  const [timeline, setTimeline] = useState<MatrixEvent[]>()
  const [announcement, setAnnouncement] = useState<string>()
  const [view, setView] = useState<ViewData>()
  const [actions, setActions] = useState<AnchorActions>()

  useEffect(() => {
    async function connect() {
      // @ts-ignore
      let isSynced = () => client.isInitialSyncComplete()
      // Immediately fetch these room state values in the background to render them before the entire chat sync finishes.
      greedyLoadState(isSynced, AnchorViewEventType, setView)
      greedyLoadState(isSynced, 'm.room.topic', ({ topic }) =>
        setAnnouncement(topic),
      )

      let userMode = localStorage.getItem('mx_user_mode') || 'guest'
      let userId = localStorage.getItem('mx_user_id')
      let accessToken = localStorage.getItem('mx_access_token')
      const isGuest = userMode === 'guest'

      client = createClient({
        baseUrl: isGuest ? matrixGuestServer : matrixServer,
        userId,
        accessToken: isGuest ? 'guest' : accessToken,
      })

      setActions({
        register: async (username, password, captchaToken) => {
          const registerClient = createClient({ baseUrl: matrixServer })
          let authSessionId
          const doRegister = (sessionId, auth) => {
            return registerClient.register(
              username,
              password,
              sessionId,
              auth,
              null,
              // FIXME: results in "M_UNKNOWN: No row found (users)" from server. Why?
              //userMode === 'guest' ? registerClient.getAccessToken() : null,
            )
          }
          try {
            await doRegister(null, {
              type: 'm.login.recaptcha',
              response: captchaToken,
            })
          } catch (err) {
            if (err.errcode) {
              throw err
            }
            authSessionId = err.data.session
          }

          // We must submit a second time to satisfy the Matrix dummy login flow.
          const res = await doRegister(authSessionId, {
            type: 'm.login.dummy',
          })

          localStorage.setItem('mx_user_mode', 'account')
          localStorage.setItem('mx_user_id', res['user_id'])
          localStorage.setItem('mx_access_token', res['access_token'])
          await connect()
        },
        login: async (username, password) => {
          const loginClient = createClient({ baseUrl: matrixServer })
          const res = await loginClient.loginWithPassword(username, password)
          localStorage.setItem('mx_user_mode', 'account')
          localStorage.setItem('mx_user_id', res['user_id'])
          localStorage.setItem('mx_access_token', res['access_token'])
          await connect()
        },
        logout: async () => {
          await client.logout()
          localStorage.removeItem('mx_user_mode')
          localStorage.removeItem('mx_user_id')
          localStorage.removeItem('mx_access_token')
          await connect()
        },
        sendMessage: async (body) => {
          await client.sendTextMessage(chatRoomId, body, '')
        },
        mxcURL: (mxcURL, width, height, resizeMethod, allowDirectLinks) => {
          return client.mxcUrlToHttp(
            mxcURL,
            width,
            height,
            resizeMethod,
            allowDirectLinks,
          )
        },
      })

      function updateLatestAnnouncement(chatRoom) {
        const topicEvent = chatRoom.currentState.getStateEvents(
          'm.room.topic',
          '',
        ) as MatrixEvent
        if (!topicEvent) {
          return
        }
        // @ts-ignore
        setAnnouncement(topicEvent.getContent()?.topic)
      }

      function updateTimeline(timeline) {
        // TODO: filter these server-side?
        const filteredEvents = timeline.filter(
          (ev) => ev.getType() === 'm.room.message' && ev.event.content.body,
        )
        setTimeline(filteredEvents)
      }

      client.on(
        'Room.timeline',
        debounce((event: MatrixEvent, room: Room) => {
          if (room.roomId === chatRoomId) {
            const roomUpdate = client.getRoom(chatRoomId)
            if (!roomUpdate) {
              return
            }
            setRoom(roomUpdate)
            updateTimeline(roomUpdate?.timeline)
            updateLatestAnnouncement(roomUpdate)
          }
        }),
      )

      // TODO: Add a way to disable this to matrix-js-sdk
      // @ts-ignore
      client._supportsVoip = false

      if (isGuest) {
        // TODO: Hack client internals to obviate creating a filter on the
        // server, so we can use the read only guest proxy.
        client.getOrCreateFilter = async () =>
          JSON.stringify({
            room: {
              ephemeral: {
                types: [],
              },
              timeline: {
                limit: initialSyncLimit,
              },
              state: {
                lazy_load_members: true,
                include_redundant_members: true,
              },
            },
          })

        // Also prevent fetching push rules.
        client.getPushRules = async () => ({})
      }

      await client.startClient({ initialSyncLimit })
      if (!isGuest) {
        await client.joinRoom(chatRoomId)
      }

      await once(client, 'sync')

      client.on('RoomState.events', (event) => {
        if (event.getType() !== AnchorViewEventType) {
          return
        }
        setView(event.getContent())
      })

      const chatRoom = client.getRoom(chatRoomId)
      setUserInfo({
        userId: client.credentials.userId,
        isGuest,
      })
      updateLatestAnnouncement(chatRoom)
      setRoom(chatRoom)
      updateTimeline(chatRoom?.timeline)

      const anchorViewEvent = chatRoom.currentState.getStateEvents(
        AnchorViewEventType,
        '',
      ) as MatrixEvent
      if (anchorViewEvent) {
        // @ts-ignore
        setView(anchorViewEvent.getContent())
      }
    }

    connect()

    return () => {
      if (client) {
        client.stopClient()
      }
    }
  }, [])

  return { userInfo, room, timeline, announcement, view, actions }
}

export default useAnchor
