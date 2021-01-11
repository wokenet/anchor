import * as React from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  chakra,
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
  Text,
  IconButton,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import useResizeObserver from 'use-resize-observer'
import { FaBullhorn, FaEye } from 'react-icons/fa'
import { AiFillSmile } from 'react-icons/ai'

import Page from '../components/Page'
import FooterLinks from '../components/FooterLinks'
import AuthDrawer from '../components/AuthDrawer'
import { MessageText, ChatEvent } from '../components/messages'
import View from '../components/View'
import useAnchor from '../useAnchor'
import Scrollbars, { ReactCustomScrollbars } from '../components/Scrollbars'
import Header from '../components/Header'
import IntroOverlay from '../components/IntroOverlay'
import EmotePicker from '../components/EmotePicker'
import useTinyCount from '../useTinyCount'
import { maxMessageSize } from '../../constants.json'

const INTRO_SEEN_KEY = 'intro_seen'

function Announcement({ isOpen, onClose, children, zIndex }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="announcement"
          transition={{ type: 'tween' }}
          initial={{ height: 0, overflow: 'hidden' }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
        >
          <Alert status="info" bg="gray.700" flexShrink={0} zIndex={zIndex}>
            <AlertIcon
              as={FaBullhorn}
              color="orangeYellow.500"
              flexShrink={0}
            />
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

function ChatEntry({ onSend }) {
  const {
    register: registerField,
    watch: watchField,
    setValue: setFieldValue,
    handleSubmit,
  } = useForm({
    defaultValues: { message: '' },
  })
  const inputRef = useRef<HTMLInputElement>()
  const {
    isOpen: isPickerOpen,
    onClose: onPickerClose,
    onToggle: onTogglePickerOpen,
  } = useDisclosure()

  const messageText = watchField('message')
  const showLengthWarning = messageText.length > maxMessageSize * 0.75
  const rightElementWidth = showLengthWarning ? '4.5rem' : undefined

  function handleTogglePickerOpen() {
    onTogglePickerOpen()
    if (isPickerOpen) {
      inputRef.current.focus()
    }
  }

  function handlePickEmote(emote) {
    const messageParts = [
      messageText,
      messageText && !messageText.endsWith(' ') ? ' ' : '',
      emote,
      ' ',
    ]
    setFieldValue('message', messageParts.join(''))
    inputRef.current.focus()
  }

  return (
    <Flex flexDir="column">
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div
            key="picker"
            transition={{ type: 'tween' }}
            initial={{ height: 0, overflow: 'hidden' }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <EmotePicker
              onClose={onPickerClose}
              onPickEmote={handlePickEmote}
              height="15rem"
              px={2}
              mt={1}
              bg="gray.700"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <chakra.form
        onSubmit={(ev) => {
          handleSubmit(onSend)(ev)
          setFieldValue('message', '')
        }}
        autoComplete="off"
        display="flex"
        flexDir="column"
        bg={isPickerOpen ? 'gray.700' : 'initial'}
        transitionProperty="colors"
        transitionDuration="normal"
      >
        <InputGroup w="auto" m={2}>
          <Input
            name="message"
            px={2}
            pr={rightElementWidth}
            color="gray.200"
            bg="gray.950"
            focusBorderColor="flame.600"
            placeholder="Say something"
            maxLength={maxMessageSize}
            ref={(v) => {
              registerField(v)
              inputRef.current = v
            }}
          />
          <InputRightElement
            w={rightElementWidth}
            justifyContent="flex-end"
            pointerEvents="none"
            px={1}
          >
            {showLengthWarning ? (
              <Text fontSize="sm" color="flame.300" userSelect="none" pr={1}>
                {maxMessageSize - messageText.length}
              </Text>
            ) : null}
            <IconButton
              variant="ghost"
              size="sm"
              icon={
                <Icon
                  as={AiFillSmile}
                  color={isPickerOpen ? 'orangeYellow.100' : 'gray.200'}
                />
              }
              bg={isPickerOpen ? 'orangeYellow.600' : undefined}
              _hover={{ bg: isPickerOpen ? 'orangeYellow.700' : 'gray.700' }}
              fontSize="1.5rem"
              pointerEvents="auto"
              aria-label="Select emote"
              onClick={handleTogglePickerOpen}
            />
          </InputRightElement>
        </InputGroup>
      </chakra.form>
    </Flex>
  )
}

function Home() {
  const messagesRef = useRef<ReactCustomScrollbars>()
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

  async function handleSend({ message }) {
    if (!message.length) {
      return
    }
    await actions.sendMessage(message)
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

  const { ref: chatContainerRef } = useResizeObserver({
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
          flexDir="column"
          w={{ base: 'full', lg: 'sm' }}
          flex={{ base: 1, lg: 'none' }}
          justifyContent="flex-end"
          overflow="hidden"
        >
          {timeline ? (
            <Flex ref={chatContainerRef} overflow="hidden">
              <Scrollbars
                ref={messagesRef}
                onScrollFrame={handleScrollMessages}
                autoHeightMax="100%"
                autoHeight
              >
                {timeline.map((ev) => (
                  <ChatEvent
                    // @ts-ignore
                    key={ev.getId()}
                    ev={ev}
                    member={room.getMember(ev.getSender())}
                    mxcURL={actions?.mxcURL}
                  />
                ))}
              </Scrollbars>
            </Flex>
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
            <ChatEntry onSend={handleSend} />
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
