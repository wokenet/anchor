import * as React from 'react'
import { useState } from 'react'
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Center,
  DrawerHeader,
  DrawerBody,
  VStack,
  Input,
  Flex,
  Button,
  DrawerFooter,
  Divider,
  Link,
  DrawerCloseButton,
  Text,
  Box,
  Checkbox,
  Heading,
} from '@chakra-ui/react'
import { Scrollbars } from 'react-custom-scrollbars'
import ReCAPTCHA from 'react-google-recaptcha'

import { siteName, recaptchaSiteKey } from '../../constants.json'
import Rules from './Rules'

const RECAPTCHA_WIDTH = '304px'
const RECAPTCHA_HEIGHT = '78px'

function RulesPane({ onAccept }) {
  const [isAccepted, setIsAccepted] = useState<boolean>(false)
  return (
    <Scrollbars
      renderThumbVertical={(props) => (
        <Box {...props} bgColor="gray.600" borderRadius="full" />
      )}
      autoHeightMax="100vh"
      autoHeight
    >
      <DrawerHeader textAlign="center">Community Rules</DrawerHeader>
      <DrawerBody>
        <VStack alignItems="flex-start" mb={2} spacing={4} color="gray.200">
          <Rules />
        </VStack>
      </DrawerBody>
      <DrawerFooter flexDirection="column">
        <Checkbox
          colorScheme="orangeYellow"
          isChecked={isAccepted}
          onChange={(ev) => setIsAccepted(ev.target.checked)}
          mb={8}
        >
          Alright, understood. 👍
        </Checkbox>
        <Button
          colorScheme="orangeYellow"
          onClick={onAccept}
          isDisabled={!isAccepted}
        >
          Let's chat!
        </Button>
      </DrawerFooter>
    </Scrollbars>
  )
}

function AuthForm({ onRegister, onLogin, onCancel }) {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isCAPTCHALoaded, setIsCAPTCHALoaded] = useState(false)
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
    <form onSubmit={handleSubmit}>
      <Center flexDir="column">
        <DrawerHeader>
          {mode === 'register'
            ? `Create a ${siteName} account`
            : `Log in to ${siteName}`}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} px={0} w={RECAPTCHA_WIDTH} alignItems="center">
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
              <Box w={RECAPTCHA_WIDTH} h={RECAPTCHA_HEIGHT}>
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={setCaptchaToken}
                  theme="dark"
                />
              </Box>
            )}
            <Flex alignItems="baseline" fontSize="md">
              <Text>
                {mode === 'register' ? 'Have an account?' : 'Need an account?'}
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
            <Button variant="outline" mr={3} onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="orangeYellow">
              {mode === 'register' ? 'Register' : 'Login'}
            </Button>
          </Flex>
          <Divider my={8} />
          <Text color="gray.300">
            WOKE.NET is brand new and we're still ironing out bugs. If you run
            into any unexpected problems, please{' '}
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
      </Center>
    </form>
  )
}

export default function AuthDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  onRegister,
  onLogin,
}) {
  const [rulesAccepted, setRulesAccepted] = useState<boolean>(false)

  return (
    <Drawer
      placement="right"
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
    >
      <DrawerOverlay>
        <DrawerContent justifyContent="center" maxW="24rem">
          {!rulesAccepted ? (
            <RulesPane onAccept={() => setRulesAccepted(true)} />
          ) : (
            <AuthForm
              onRegister={onRegister}
              onLogin={onLogin}
              onCancel={onClose}
            />
          )}
          <DrawerCloseButton />
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
