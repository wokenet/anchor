import * as React from 'react'
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
  Skeleton,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scrollbars } from 'react-custom-scrollbars'
import useResizeObserver from 'use-resize-observer'
import { FaEye } from 'react-icons/fa'

import Page from '../components/Page'
import FooterLinks from '../components/FooterLinks'
import AuthDrawer from '../components/AuthDrawer'
import { MessageText, renderEvent } from '../components/messages'
import View from '../components/View'
import useAnchor from '../useAnchor'
import Header from '../components/Header'
import IntroOverlay from '../components/IntroOverlay'
import useTinyCount from '../useTinyCount'
import { maximumMessageSize } from '../../constants.json'

const INTRO_SEEN_KEY = 'intro_seen'

function Announcement({ isOpen, onClose, children, zIndex }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="announcement"
          initial={{ height: 0, overflow: 'hidden' }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
        >
          <Alert status="info" bg="gray.700" flexShrink={0} zIndex={zIndex}>
            <AlertIcon color="orangeYellow.500" flexShrink={0} />
            <AlertDescription mr={6}>
              <MessageText>{children}</MessageText>
            </AlertDescription>
            <CloseButton onClick={onClose} position="absolute" right="8px" />
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
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
  const {
    isOpen: isIntroOpen,
    onOpen: onIntroOpen,
    onClose: onIntroClose,
  } = useDisclosure()
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    if (!localStorage.getItem(INTRO_SEEN_KEY)) {
      onIntroOpen()
    }
  }, [])

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

  function handleScrollMessages({ scrollTop, clientHeight, scrollHeight }) {
    const pxFromBottom = scrollHeight - (scrollTop + clientHeight)
    isScrollPinned.current = pxFromBottom <= 15
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

  const { ref: chatRef } = useResizeObserver({
    onResize: () => {
      requestAnimationFrame(updateScroll)
    },
  })

  useLayoutEffect(updateScroll, [timeline])

  useEffect(() => {
    if (announcement) {
      onAnnouncementOpen()
    } else {
      onAnnouncementClose()
    }
  }, [announcement])

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
          <Announcement
            isOpen={isAnnouncementOpen}
            onClose={onAnnouncementClose}
            zIndex={200}
          >
            {announcement}
          </Announcement>
          <Center
            position="relative"
            flex={1}
            overflow="hidden"
            backgroundColor="gray.950"
          >
            {view?.kind ? (
              <View view={view} />
            ) : (
              <Skeleton
                width="full"
                height={{ base: `${100 * (9 / 16)}vw`, lg: 'full' }}
                startColor="gray.800"
                endColor="gray.900"
              />
            )}
            <IntroOverlay
              isOpen={isIntroOpen}
              onClose={handleDismissIntro}
              zIndex={100}
            />
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
        </Flex>
        <Flex
          ref={chatRef}
          flexDir="column"
          w={{ base: 'full', lg: 'sm' }}
          flex={{ base: 1, lg: 'none' }}
          justifyContent="flex-end"
          overflow="hidden"
        >
          {timeline ? (
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
              {timeline.map(renderEvent)}
            </Scrollbars>
          ) : (
            <SkeletonText
              m={4}
              mb={14}
              noOfLines={10}
              spacing={4}
              startColor="gray.800"
              endColor="gray.900"
            />
          )}
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
            // The `pr` attribute below is because of this bug: https://github.com/chakra-ui/chakra-ui/commit/d95cdc6469695676d4da1710f365b485052a044a
            <form onSubmit={handleSend} style={{ display: 'flex' }}>
              <InputGroup flex={1} m={2}>
                <Input
                  px={2}
                  color="gray.200"
                  focusBorderColor="flame.600"
                  placeholder="Say something"
                  value={messageText}
                  maxLength={maximumMessageSize}
                  pr={messageText.length <= 250 ? 2 : null}
                  onChange={(ev) => setMessageText(ev.target.value)}
                />
                {messageText.length <= 250 ? null : (
                  <InputRightElement
                    flexShrink={0}
                    fontSize="sm"
                    color="flame.300"
                    pointerEvents="none"
                  >
                    {maximumMessageSize - messageText.length}
                  </InputRightElement>
                )}
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
