import { useEffect, useState } from 'react'
import { createClient, Room, MatrixEvent, MatrixClient } from 'matrix-js-sdk'

const roomAlias = '#anchor:woke.net'

function useAnchor() {
  let client: MatrixClient
  const [room, setRoom] = useState<Room>()
  const [timeline, setTimeline] = useState<MatrixEvent[]>()

  useEffect(() => {
    async function connect() {
      let userId = localStorage.getItem('mx_user_id')
      let accessToken = localStorage.getItem('mx_access_token')
      if (!userId || !accessToken) {
        client = createClient({
          baseUrl: 'https://matrix.woke.net',
        })
        const reg = await client.registerGuest()
        userId = reg.user_id
        accessToken = reg.access_token
        localStorage.setItem('mx_user_id', userId)
        localStorage.setItem('mx_access_token', accessToken)
      }

      client = createClient({
        baseUrl: 'https://matrix.woke.net',
        userId,
        accessToken,
      })
      client.setGuest(true)

      const roomResult = await client.getRoomIdForAlias(roomAlias)
      if (!roomResult) {
        console.error('Room not found', roomAlias)
        return
      }
      const roomId = roomResult.room_id

      client.on('Room.timeline', () => {
        const roomUpdate = client.getRoom(roomId)
        if (!roomUpdate) {
          return
        }
        setRoom(roomUpdate)
        setTimeline([...roomUpdate?.timeline])
      })

      await client.peekInRoom(roomId)

      const room = client.getRoom(roomId)
      setRoom(room)
      setTimeline(room?.timeline)
    }
    connect()

    return () => {
      if (client) {
        client.stopClient()
      }
    }
  }, [])

  return { room, timeline }
}

export default useAnchor
