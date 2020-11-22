import { once } from 'events'
import { useEffect, useState } from 'react'
import {
  createClient,
  EventType,
  Room,
  MatrixEvent,
  MatrixClient,
} from 'matrix-js-sdk'

const roomAlias = '#anchor:woke.net'

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
  kind: 'hls' | 'embed'
  url: string
  fill: boolean
}

const AnchorViewEventType = 'net.woke.anchor.view' as EventType

function useAnchor() {
  let client: MatrixClient
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [room, setRoom] = useState<Room>()
  const [timeline, setTimeline] = useState<MatrixEvent[]>()
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

      const roomResult = await client.getRoomIdForAlias(roomAlias)
      if (!roomResult) {
        console.error('Room not found', roomAlias)
        return
      }
      const roomId = roomResult['room_id']

      client.on('Room.timeline', () => {
        const roomUpdate = client.getRoom(roomId)
        if (!roomUpdate) {
          return
        }
        setRoom(roomUpdate)
        setTimeline([...roomUpdate?.timeline])
      })

      if (client.isGuest()) {
        await client.peekInRoom(roomId)
      } else {
        await client.startClient({ initialSyncLimit: 40 })
        await once(client, 'sync')
        await client.joinRoom(roomId)
      }

      client.on('RoomState.events', (event) => {
        if (event.getType() !== AnchorViewEventType) {
          return
        }
        setView(event.getContent())
      })

      const room = client.getRoom(roomId)
      setUserInfo({
        userId: client.credentials.userId,
        isGuest: client.isGuest(),
      })
      setRoom(room)
      setTimeline(room?.timeline)
      const anchorViewEvent = room.currentState.getStateEvents(
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
          await client.sendTextMessage(roomId, body, '')
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

  return { userInfo, room, timeline, view, actions }
}

export default useAnchor
