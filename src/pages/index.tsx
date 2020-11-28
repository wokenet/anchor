import * as React from 'react'
import { useEffect, useLayoutEffect, useState, useRef } from 'react'
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
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
  Icon,
  Divider,
  Link,
} from '@chakra-ui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Scrollbars } from 'react-custom-scrollbars'
import { FaEye } from 'react-icons/fa'

import { siteName, recaptchaSiteKey } from '../../constants.json'
import Page from '../components/Page'
import FooterLinks from '../components/FooterLinks'
import Message from '../components/Message'
import View from '../components/View'
import useAnchor from '../useAnchor'
import IntroOverlay from '../components/IntroOverlay'
import useTinyCount from '../useTinyCount'

const RECAPTCHA_WIDTH = '304px'
const INTRO_SEEN_KEY = 'intro_seen'

function AuthDrawer({ isOpen, onClose, finalFocusRef, onRegister, onLogin }) {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string>()

  function handleToggleMode() {
    setMode(mode === 'register' ? 'login' : 'register')
  }

  function handleSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault()
    if (mode === 'register') {
      onRegister(username, password, captchaToken)
    } else {
      onLogin(username, password)
    }
  }

  return (
    <Drawer
      placement="right"
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
    >
      <DrawerOverlay>
        <form onSubmit={handleSubmit}>
          <DrawerContent justifyContent="center" maxW="24rem">
            <Center flexDir="column">
              <DrawerHeader>
                {mode === 'register'
                  ? `Create a ${siteName} account`
                  : `Log in to ${siteName}`}
              </DrawerHeader>

              <DrawerBody>
                <VStack
                  spacing={4}
                  px={0}
                  w={RECAPTCHA_WIDTH}
                  alignItems="center"
                >
                  <Input
                    focusBorderColor="orangeYellow.300"
                    placeholder="Username"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                  />
                  <Input
                    focusBorderColor="orangeYellow.300"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                  />
                  {mode === 'register' && (
                    <ReCAPTCHA
                      sitekey={recaptchaSiteKey}
                      onChange={setCaptchaToken}
                      theme="dark"
                    />
                  )}
                  <Flex alignItems="baseline" fontSize="md">
                    <Text>
                      {mode === 'register'
                        ? 'Have an account?'
                        : 'Need an account?'}
                    </Text>
                    <Button
                      onClick={handleToggleMode}
                      ml=".5em"
                      colorScheme="orangeYellow"
                      variant="link"
                    >
                      {mode === 'register' ? 'Login' : 'Register'}
                    </Button>
                    <Text>.</Text>
                  </Flex>
                </VStack>
              </DrawerBody>
              <DrawerFooter flexDirection="column" w="full">
                <Flex>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="orangeYellow">
                    {mode === 'register' ? 'Register' : 'Login'}
                  </Button>
                </Flex>
                <Divider my={8} />
                <Text color="gray.300">
                  WOKE.NET is brand new and we're still ironing out bugs. If you
                  run into any unexpected problems, please{' '}
                  <Link
                    href="https://github.com/wokenet/anchor/issues"
                    color="orangeYellow.200"
                    isExternal
                  >
                    let us know
                  </Link>
                  . :)
                </Text>
              </DrawerFooter>
              <DrawerCloseButton />
            </Center>
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  )
}

function Announcement({ onClose, children, zIndex }) {
  return (
    <Alert status="info" bg="gray.700" flexShrink={0} zIndex={zIndex}>
      <AlertIcon color="orangeYellow.500" />
      <AlertDescription>{children}</AlertDescription>
      <CloseButton onClick={onClose} position="absolute" right="8px" />
    </Alert>
  )
}

function Home() {
  // TODO: registration/login error handling
  const messagesRef = useRef<Scrollbars>()
  const authButtonRef = useRef<HTMLButtonElement>()
  const { userInfo, timeline, announcement, view, room, actions } = useAnchor()
  const onlineCount = useTinyCount('https://get.woke.net/viewers/')
  const {
    isOpen: isAuthOpen,
    onOpen: onAuthOpen,
    onClose: onAuthClose,
  } = useDisclosure()
  const {
    isOpen: isAnnouncementOpen,
    onOpen: onAnnouncementOpen,
    onClose: onAnnouncementClose,
  } = useDisclosure()
  const { isOpen: isIntroOpen, onClose: onIntroClose } = useDisclosure({
    defaultIsOpen:
      typeof localStorage !== 'undefined'
        ? !localStorage.getItem(INTRO_SEEN_KEY)
        : false,
  })
  const [messageText, setMessageText] = useState('')

  function handleDismissIntro() {
    onIntroClose()
    localStorage.setItem(INTRO_SEEN_KEY, '1')
  }

  async function handleRegister(username, password, captchaToken) {
    await actions.register(username, password, captchaToken)
    onAuthClose()
  }

  async function handleLogin(username, password) {
    await actions.login(username, password)
    onAuthClose()
  }

  async function handleSend(ev: React.SyntheticEvent) {
    ev.preventDefault()
    setMessageText('')
    if (!messageText.length) {
      return
    }
    await actions.sendMessage(messageText)
  }

  useEffect(() => {
    if (announcement) {
      onAnnouncementOpen()
    } else {
      onAnnouncementClose()
    }
  }, [announcement])

  useLayoutEffect(() => {
    const el = messagesRef.current
    if (!el) {
      return
    }
    el.scrollToBottom()
  }, [timeline])

  return (
    <Page>
      <Flex
        display="flex"
        flex="1"
        direction={{ base: 'column', lg: 'row' }}
        overflow="hidden"
      >
        <Flex
          flexDirection="column"
          flex={{ base: 0, lg: 1 }}
          position="relative"
        >
          {isAnnouncementOpen && (
            <Announcement onClose={onAnnouncementClose} zIndex={200}>
              {announcement}
            </Announcement>
          )}
          <Center flex={1} overflow="hidden" backgroundColor="gray.950">
            {view?.kind && <View view={view} />}
          </Center>
          <Flex>
            <FooterLinks flex="1" display={{ base: 'none', lg: 'flex' }} />
            {onlineCount !== undefined && (
              <Flex
                position="absolute"
                bottom="0"
                right={{ base: 'unset', lg: 0 }}
                left={{ base: 0, lg: 'unset' }}
                color="flame.100"
                alignItems="center"
                mx={4}
                my={{ base: 2, lg: 4 }}
                opacity={{ base: 0.5, lg: 1 }}
                zIndex={200}
              >
                <Icon as={FaEye} color="flame.500" boxSize={5} mr={2} />
                {onlineCount} watching
              </Flex>
            )}
          </Flex>
          <IntroOverlay
            isOpen={isIntroOpen}
            onClose={handleDismissIntro}
            zIndex={100}
          />
        </Flex>
        <Flex
          flexDir="column"
          w={{ base: 'full', lg: 'sm' }}
          flex={{ base: 1, lg: 'none' }}
        >
          <Scrollbars
            ref={messagesRef}
            renderThumbVertical={(props) => (
              <Box {...props} bgColor="gray.600" borderRadius="full" />
            )}
            autoHide
            universal
          >
            {timeline &&
              timeline.map((ev) => {
                if (
                  ev.getType() !== 'm.room.message' ||
                  !ev.event.content.body
                ) {
                  return
                }
                return (
                  <Message
                    key={ev.event.event_id}
                    sender={ev.sender.name}
                    body={ev.event.content.body}
                    px={4}
                    _odd={{ backgroundColor: 'gray.900' }}
                  />
                )
              })}
          </Scrollbars>
          {!userInfo ? null : userInfo.isGuest ? (
            <Button
              ref={authButtonRef}
              colorScheme="orangeYellow"
              onClick={onAuthOpen}
              mx={4}
              mb={4}
            >
              Start chatting
            </Button>
          ) : (
            <form onSubmit={handleSend} style={{ display: 'flex' }}>
              <Input
                m={2}
                px={2}
                flex={1}
                focusBorderColor="flame.600"
                placeholder="Say something"
                value={messageText}
                onChange={(ev) => setMessageText(ev.target.value)}
              />
            </form>
          )}
        </Flex>
        <AuthDrawer
          isOpen={isAuthOpen}
          onClose={onAuthClose}
          finalFocusRef={authButtonRef}
          onRegister={handleRegister}
          onLogin={handleLogin}
        />
      </Flex>
    </Page>
  )
}

export default Home
