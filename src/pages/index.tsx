import * as React from 'react'
import { useState, useRef } from 'react'
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'

import { siteName } from '../constants'
import Video from '../Video'
import useAnchor from '../useAnchor'

function AuthDrawer({ isOpen, onClose, finalFocusRef, getContainer }) {
  const [mode, setMode] = useState<'login' | 'register'>('register')

  function handleToggleMode() {
    setMode(mode === 'register' ? 'login' : 'register')
  }

  return (
    <Drawer
      size="xs"
      placement="right"
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      getContainer={getContainer}
    >
      <DrawerOverlay>
        <DrawerContent justifyContent="center">
          <Center flexDir="column">
            <DrawerHeader>
              {mode === 'register'
                ? `Create a ${siteName} account`
                : `Log in to ${siteName}`}
            </DrawerHeader>

            <DrawerBody width="full">
              <VStack spacing={4} px={0}>
                <Input placeholder="Username" />
                <Input placeholder="Password" type="password" />
                <Flex alignItems="baseline" fontSize="md">
                  <Text>
                    {mode === 'register'
                      ? 'Have an account?'
                      : 'Need an account?'}
                  </Text>
                  <Button
                    onClick={handleToggleMode}
                    ml=".5em"
                    colorScheme="teal"
                    variant="link"
                  >
                    {mode === 'register' ? 'Login' : 'Register'}
                  </Button>
                  <Text>.</Text>
                </Flex>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal">
                {mode === 'register' ? 'Register' : 'Login'}
              </Button>
            </DrawerFooter>
            <DrawerCloseButton />
          </Center>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}

function Home() {
  const authButtonRef = useRef<HTMLButtonElement>()
  const chatRef = useRef<HTMLDivElement>()
  const videoRef = useRef<HTMLVideoElement>()
  const { timeline } = useAnchor()
  const {
    isOpen: isAuthOpen,
    onOpen: onAuthOpen,
    onClose: onAuthClose,
  } = useDisclosure()

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
      <Flex flexDir="column" ref={chatRef} w="sm">
        <Box flex="1" my={2} mx={4} overflowY="auto">
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
        <Button
          ref={authButtonRef}
          colorScheme="teal"
          onClick={onAuthOpen}
          mx={4}
          mb={4}
        >
          Log in to chat
        </Button>
      </Flex>
      <AuthDrawer
        isOpen={isAuthOpen}
        onClose={onAuthClose}
        finalFocusRef={authButtonRef}
        getContainer={() => chatRef.current}
      />
    </Box>
  )
}

export default Home
