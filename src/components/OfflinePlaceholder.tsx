import * as React from 'react'
import Link from 'next/link'
import {
  Box,
  Center,
  Text,
  chakra,
  VStack,
  Button,
  ButtonGroup,
} from '@chakra-ui/react'

import BackgroundVideo from 'woke-content/images/bg.mp4'

const VideoEl = chakra('video')

export default function OfflinePlacholder() {
  return (
    <Box position="relative" maxHeight="full">
      <Center position="absolute" w="full" h="full" zIndex={100}>
        <VStack mb={2}>
          <Text
            fontFamily="Oswald"
            fontSize="3xl"
            color="flame.600"
            textShadow="0 0 5px black"
            whiteSpace="nowrap"
          >
            Searching for livestreams...
          </Text>
          <Link href="/submit" passHref>
            <Button
              opacity="0.85"
              variant="outline"
              colorScheme="orange"
              size="sm"
              my={1}
            >
              Submit stream
            </Button>
          </Link>
        </VStack>
      </Center>
      <VideoEl src={BackgroundVideo} opacity=".075" autoPlay muted loop />
    </Box>
  )
}
