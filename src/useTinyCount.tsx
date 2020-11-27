import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

const VIEWER_ID_KEY = 'viewer_id'

export default function useTinyCount(endpoint: string) {
  const [userCount, setUserCount] = useState<number>()

  useEffect(() => {
    let id = localStorage.getItem(VIEWER_ID_KEY)
    if (!id) {
      id = nanoid()
      localStorage.setItem(VIEWER_ID_KEY, id)
    }

    let nextTimeout

    async function poll() {
      let resp, respText
      try {
        resp = await fetch(endpoint + id, { method: 'POST' })
        respText = await resp.text()
      } catch (err) {
        console.warn('Error fetching user count:', err, resp?.status, respText)
        return
      }
      if (!resp.ok) {
        console.warn(
          'Error response when fetching user count:',
          resp.status,
          respText,
        )
        return
      }

      const nextCount = Number(respText)
      setUserCount(nextCount)

      let interval = 60
      const cc = resp.headers.get('Cache-Control')
      const maxAge = cc.match(/max-age=(\d+)/)
      if (maxAge) {
        interval = Number(maxAge[1])
      }
      nextTimeout = setTimeout(poll, interval * 1000)
    }

    poll()

    return () => {
      clearTimeout(nextTimeout)
    }
  }, [])

  return userCount
}
