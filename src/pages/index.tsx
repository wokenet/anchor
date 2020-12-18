import * as React from 'react'
import Color from 'tinycolor2'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from 'react'
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  useDisclosure,
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
  Icon,
  SkeletonText,
  useToken,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { Scrollbars } from 'react-custom-scrollbars'
import { FaEye } from 'react-icons/fa'

import Page from '../components/Page'
import FooterLinks from '../components/FooterLinks'
import AuthDrawer from '../components/AuthDrawer'
import Message from '../components/Message'
import View from '../components/View'
import useAnchor from '../useAnchor'
import Header from '../components/Header'
import IntroOverlay from '../components/IntroOverlay'
import useTinyCount from '../useTinyCount'
import { update } from 'lodash'

const INTRO_SEEN_KEY = 'intro_seen'

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
  const isScrollPinned = useRef<boolean>(true)
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

  function getSenderColor(sender: string) {
    if(sender === '@wokebot:woke.net') {
      return 'orangeYellow.500';
    }

      return idColor(sender).toHexString()
  }

  function hashText(text: string, range: number) {
    // DJBX33A-ish
    // based on https://github.com/euphoria-io/heim/blob/978c921063e6b06012fc8d16d9fbf1b3a0be1191/client/lib/hueHash.js#L16-L45
    let val = 0
    for (let i = 0; i < text.length; i++) {
      // Multiply by an arbitrary prime number to spread out similar letters.
      const charVal = (text.charCodeAt(i) * 401) % range
      // Multiply val by 33 while constraining within signed 32 bit int range.
      // this keeps the value within Number.MAX_SAFE_INTEGER without throwing out
      // information.
      const origVal = val
      val = val << 5
      val += origVal
      // Add the character to the hash.
      val += charVal
    }
    return (val + range) % range
  }

  function idColor(id: string) {
    if (!id) {
      return Color('white')
    }

    //const orangeYellow = useToken('colors', 'orangeYellow.600')
    const h = hashText(id, 60)
    const sPart = hashText(id, 60)
    return Color({ h, s: 70 + sPart, l: 60 })
  }

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

  function handleScrollMessages({ top }) {
    isScrollPinned.current = top === 1
  }

  const updateScroll = useCallback(() => {
    const el = messagesRef.current
    if (!el) {
      return
    }
    if (isScrollPinned.current) {
      el.scrollToBottom()
    }
  }, [messagesRef, isScrollPinned])

  useEffect(() => {
    window.addEventListener('resize', updateScroll)
    return () => {
      window.removeEventListener('resize', updateScroll)
    }
  })

  useEffect(() => {
    if (announcement) {
      onAnnouncementOpen()
    } else {
      onAnnouncementClose()
    }
  }, [announcement])

  useLayoutEffect(updateScroll, [timeline])

  return (
    <Page noHeader noFooter>
      <Flex
        display="flex"
        flex="1"
        direction={{ base: 'column', lg: 'row' }}
        bg="gray.950"
        overflow="hidden"
      >
        <Flex
          flexDirection="column"
          flex={{ base: 'initial', lg: 1 }}
          position="relative"
          overflow={{ base: 'visible', lg: 'hidden' }}
        >
          <Header zIndex={200} />
          {isAnnouncementOpen && (
            <Announcement onClose={onAnnouncementClose} zIndex={200}>
              {announcement}
            </Announcement>
          )}
          <Center flex={1} overflow="hidden" backgroundColor="gray.950">
            {view?.kind && <View view={view} />}
          </Center>
          <Flex
            zIndex={200}
            borderBottomWidth={{ base: 1, lg: 0 }}
            borderBottomColor="gray.700"
            borderBottomStyle="solid"
          >
            <FooterLinks flex="1" display={{ base: 'none', lg: 'flex' }} />
            {onlineCount !== undefined && (
              <Flex
                position={{ base: 'static', lg: 'absolute' }}
                bottom={{ base: 'unset', lg: 0 }}
                right={{ base: 'unset', lg: 0 }}
                color="flame.100"
                alignItems="center"
                mx={2}
                my={{ base: 0, lg: 3 }}
                p={1}
                px={2}
                borderRadius={{ base: 'none', lg: 'md' }}
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
          justifyContent="flex-end"
          overflow="hidden"
        >
          <Scrollbars
            ref={messagesRef}
            renderThumbVertical={(props) => (
              <Box {...props} bgColor="gray.600" borderRadius="full" />
            )}
            onScrollFrame={handleScrollMessages}
            autoHeightMax="100%"
            autoHeight
            autoHide
            universal
          >
            {timeline ? (
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
                    senderColor={getSenderColor(ev.sender.userId)}
                    body={ev.event.content.body.substring(0,500)}
                    px={4}
                    backgroundColor="gray.900"
                  />
                )
              })
            ) : (
              <SkeletonText
                m={4}
                mb={12}
                noOfLines={10}
                spacing={4}
                startColor="gray.800"
                endColor="gray.900"
              />
            )}
          </Scrollbars>
          {!userInfo ? null : userInfo.isGuest ? (
            <Button
              ref={authButtonRef}
              colorScheme="orangeYellow"
              onClick={onAuthOpen}
              mx={4}
              my={2}
              flexShrink={0}
            >
              Start chatting
            </Button>
          ) : (
            <form onSubmit={handleSend} style={{ display: 'flex' }}>
              <InputGroup>
                <Input
                  m={2}
                  px={2}
                  flex={1}
                  focusBorderColor="flame.600"
                  placeholder="Say something"
                  value={messageText}
                  maxLength={500}
                  onChange={(ev) => setMessageText(ev.target.value)}
                />
                <InputRightElement flexShrink={0} width={50} height={50}>
                  {messageText.length > 250 ? <small>{500-messageText.length}</small> : null}
                </InputRightElement>
              </InputGroup>
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
