import * as React from 'react'
import { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import { Scrollbars } from 'react-custom-scrollbars'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

import { siteName, recaptchaSiteKey } from '../../constants.json'
import Rules from './Rules'
import { MatrixError } from 'matrix-js-sdk'

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
  const {
    register: registerField,
    unregister: unregisterField,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    errors,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      captchaToken: '',
      server: null,
    },
  })

  useEffect(() => {
    if (mode === 'register') {
      registerField('captchaToken', {
        required: 'Please complete the CAPTCHA.',
      })
    } else {
      unregisterField('captchaToken')
    }
  }, [mode, registerField, unregisterField])

  const firstError = Object.values(errors)[0]

  function handleToggleMode() {
    setMode(mode === 'register' ? 'login' : 'register')
    clearErrors()
  }

  async function performAuth({ username, password, captchaToken }) {
    try {
      if (mode === 'register') {
        await onRegister(username, password, captchaToken)
      } else {
        await onLogin(username, password)
      }
    } catch (err) {
      if (!(err instanceof MatrixError)) {
        throw err
      }
      let field: string = 'server'
      let { name, message } = err
      if (err.name === 'M_USER_IN_USE') {
        field = 'username'
        name = 'taken'
        message = 'Username taken.'
      } else if (err.name === 'M_INVALID_USERNAME') {
        field = 'username'
        name = 'invalid'
      }
      if (!message.endsWith('.')) {
        message = message + '.'
      }
      setError(field, { type: name, message: message })
    }
  }

  return (
    <form
      onSubmit={(ev) => {
        clearErrors('server')
        handleSubmit(performAuth)(ev)
      }}
    >
      <Center flexDir="column">
        <DrawerHeader>
          {mode === 'register'
            ? `Create a ${siteName} account`
            : `Log in to ${siteName}`}
        </DrawerHeader>
        <DrawerBody w={RECAPTCHA_WIDTH} px={0} overflow="hidden">
          <VStack spacing={4} px={0} alignItems="center">
            <Input
              name="username"
              focusBorderColor="orangeYellow.300"
              placeholder="Username"
              ref={registerField({ required: 'Please enter a username.' })}
            />
            <Input
              name="password"
              focusBorderColor="orangeYellow.300"
              placeholder="Password"
              type="password"
              ref={registerField({ required: 'Please enter a password.' })}
            />
            {mode === 'register' && (
              <Box w={RECAPTCHA_WIDTH} h={RECAPTCHA_HEIGHT}>
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={(token) => setValue('captchaToken', token)}
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
          <AnimatePresence>
            {firstError && (
              <motion.div
                key="error"
                transition={{ type: 'spring', duration: 0.5 }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Text
                  color="deepRed.500"
                  fontWeight="bold"
                  textAlign="center"
                  pt={4}
                >
                  {firstError.message}
                </Text>
              </motion.div>
            )}
          </AnimatePresence>
        </DrawerBody>
        <DrawerFooter flexDirection="column" w="full">
          <Flex>
            <Button variant="outline" mr={3} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              colorScheme="orangeYellow"
            >
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
      autoFocus={rulesAccepted}
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
