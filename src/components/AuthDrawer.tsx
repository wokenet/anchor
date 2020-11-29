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
} from '@chakra-ui/react'
import ReCAPTCHA from 'react-google-recaptcha'

import { siteName, recaptchaSiteKey } from '../../constants.json'

const RECAPTCHA_WIDTH = '304px'

export default function AuthDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  onRegister,
  onLogin,
}) {
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
