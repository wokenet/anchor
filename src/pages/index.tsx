import * as React from 'react'
import { useRef } from 'react'
import { Box, Center, Text } from '@chakra-ui/react'

import Video from '../Video'
import useAnchor from '../useAnchor'

function Home() {
  const videoRef = useRef<HTMLVideoElement>()
  const { timeline } = useAnchor()

  function handleUnmute() {
    videoRef.current.muted = false
  }

  return (
    <Box display="flex" backgroundColor="gray.900" width="100vw" height="100vh">
      <Center onClick={handleUnmute} flex="1" backgroundColor="black">
        <Video
          ref={videoRef}
          src="https://a.woke.net/live/playlist.m3u8"
          muted
        />
      </Center>
      <Box w="20vw" maxW="500px">
        {timeline &&
          timeline.map((ev) => {
            if (ev.getType() !== 'm.room.message') {
              return
            }
            return (
              <Text key={ev.event.event_id}>
                {ev.sender.name}: {ev.event.content.body}
              </Text>
            )
          })}
      </Box>
    </Box>
  )
}

export default Home
