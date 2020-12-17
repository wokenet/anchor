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
import { debounce, findLast } from 'lodash'

import { chatRoomId, announcementsRoomId } from '../constants.json'

type AnchorActions = {
  register: (
    username: string,
    password: string,
    captchaToken: string,
  ) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  sendMessage: (body: string) => Promise<void>
}

type UserInfo = {
  userId: string
  isGuest: boolean
}

export type ViewData = {
  kind: 'hls' | 'embed' | 'offline'
  url: string
  fill: boolean
}

const AnchorViewEventType = 'net.woke.anchor.view' as EventType

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
      let userMode = localStorage.getItem('mx_user_mode') || 'guest'
      let userId = localStorage.getItem('mx_user_id')
      let accessToken = localStorage.getItem('mx_access_token')
      if (!userId || !accessToken) {
        client = createClient({
          baseUrl: 'https://matrix.woke.net',
        })
        const reg = await client.registerGuest()
        userId = reg['user_id']
        accessToken = reg['access_token']
        localStorage.setItem('mx_user_mode', 'guest')
        localStorage.setItem('mx_user_id', userId)
        localStorage.setItem('mx_access_token', accessToken)
      }

      client = createClient({
        baseUrl: 'https://matrix.woke.net',
        userId,
        accessToken,
      })
      if (userMode === 'guest') {
        client.setGuest(true)
      }

      function updateLatestAnnouncement() {
        const announcementsRoom = client.getRoom(announcementsRoomId)
        if (!announcementsRoom?.timeline) {
          return
        }
        const latestAnnouncement = findLast(
          announcementsRoom.timeline,
          (ev) => ev.getType() === 'm.room.message',
        )
        // @ts-ignore
        setAnnouncement(latestAnnouncement?.getContent()?.body)
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
            setTimeline([...roomUpdate?.timeline])
          } else if (room.roomId === announcementsRoomId) {
            updateLatestAnnouncement()
          }
        }),
      )

      // TODO: Add a way to disable this to matrix-js-sdk
      // @ts-ignore
      client._supportsVoip = false

      // Guest room peeking has a hardcoded limit of 20
      await client.startClient({ initialSyncLimit: 20 })

      if (client.isGuest()) {
        await client.peekInRoom(announcementsRoomId)
        await client.peekInRoom(chatRoomId)
      } else {
        await once(client, 'sync')
        await client.joinRoom(chatRoomId)
        await client.peekInRoom(announcementsRoomId)
      }

      client.on('RoomState.events', (event) => {
        if (event.getType() !== AnchorViewEventType) {
          return
        }
        setView(event.getContent())
      })

      const chatRoom = client.getRoom(chatRoomId)
      setUserInfo({
        userId: client.credentials.userId,
        isGuest: client.isGuest(),
      })
      setRoom(chatRoom)
      setTimeline(chatRoom?.timeline)
      client.scrollback(chatRoom, 30)

      updateLatestAnnouncement()

      const anchorViewEvent = chatRoom.currentState.getStateEvents(
        AnchorViewEventType,
        '',
      ) as MatrixEvent
      // @ts-ignore
      setView(anchorViewEvent.getContent())

      setActions({
        register: async (username, password, captchaToken) => {
          let authSessionId
          const doRegister = (sessionId, auth) => {
            return client.register(
              username,
              password,
              sessionId,
              auth,
              null,
              // FIXME: results in "M_UNKNOWN: No row found (users)" from server. Why?
              //userMode === 'guest' ? client.getAccessToken() : null,
            )
          }
          try {
            await doRegister(null, {
              type: 'm.login.recaptcha',
              response: captchaToken,
            })
          } catch (err) {
            if (err.errCode) {
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
          const res = await client.loginWithPassword(username, password)
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
      })
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
