import * as React from 'react'
import { Center, Flex, Text, chakra } from '@chakra-ui/react'

import BackgroundVideo from 'woke-content/images/bg.mp4'

const VideoEl = chakra('video')

export default function OfflinePlacholder() {
  return (
    <Flex position="relative" maxHeight="full">
      <Center position="absolute" w="full" h="full" zIndex={100}>
        <Text
          fontFamily="Oswald"
          fontSize="3xl"
          color="flame.600"
          textShadow="0 0 5px black"
        >
          WOKE.NET is currently offline.
        </Text>
      </Center>
      <VideoEl src={BackgroundVideo} opacity=".075" autoPlay muted loop />
    </Flex>
  )
}
