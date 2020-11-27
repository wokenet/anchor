import * as React from 'react'
import {
  Box,
  Center,
  CloseButton,
  Fade,
  Flex,
  Heading,
  Icon,
  SlideFade,
  Text,
} from '@chakra-ui/react'

import Eye from 'woke-content/images/eye.svg'

export default function IntroOverlay({ isOpen, onClose }) {
  function handleClickBackdrop(ev) {
    if (ev.target !== ev.currentTarget) {
      return
    }
    onClose()
  }

  return (
    <Fade in={isOpen} unmountOnExit={true}>
      <Center
        position="absolute"
        left="0"
        top="0"
        right="0"
        bottom="0"
        background="rgba(0, 0, 0, .5)"
        overflow="hidden"
        css={{ 'backdrop-filter': 'blur(10px)' }}
        onClick={handleClickBackdrop}
      >
        <SlideFade in={isOpen}>
          <Flex
            position="relative"
            background="gray.950"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="rgba(255, 255, 255 .1)"
            borderRadius=".75rem"
            boxShadow="0 0 24px rgba(255, 255, 255, .2)"
            width={{ base: '20rem', sm: '30rem', lg: '40rem' }}
            height={{ base: '6rem', sm: '8rem' }}
            px={{ base: 1, sm: 0 }}
            overflow="hidden"
            alignItems="center"
          >
            <Icon as={Eye} w="auto" h={{ base: '4rem', sm: '150%' }} ml={-1} />
            <Box m={4} ml={{ base: 2, sm: 4 }} color="gray.200">
              <CloseButton
                position="absolute"
                top={2}
                right={2}
                color="gray.400"
                size="md"
                onClick={onClose}
              />
              <Heading
                as="h1"
                fontWeight="normal"
                size="lg"
                fontSize={{ base: 'lg', lg: '2xl' }}
                lineHeight="150%"
                mb={0.5}
              >
                Welcome to <strong>WOKE.NET</strong>.
              </Heading>
              <Text fontSize={{ base: 'xs', lg: 'md' }}>
                We amplify the voices of demonstrators and streamers from the
                ground in protests across the USA.
              </Text>
            </Box>
          </Flex>
        </SlideFade>
      </Center>
    </Fade>
  )
}
