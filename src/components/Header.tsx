import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Flex,
  HStack,
  Icon,
  Link as ChakraLink,
  Spacer,
} from '@chakra-ui/react'
import {
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaPeriscope,
  FaTwitch,
  FaDiscord,
  FaRedditAlien,
} from 'react-icons/fa'

import LogoIcon from 'woke-content/images/logo.svg'

function NavLink({ href, children }) {
  const { pathname } = useRouter()
  const isActive = pathname === href

  return (
    <Link href={href} passHref>
      <ChakraLink
        color={isActive ? 'orangeYellow.50' : 'orangeYellow.500'}
        fontFamily="Oswald"
        letterSpacing=".05em"
        background={isActive ? 'orangeYellow.700' : 'transparent'}
        borderRadius={2}
        _hover={{
          textDecoration: 'none',
          background: isActive ? 'orangeYellow.600' : 'orangeYellow.800',
        }}
        px={2}
        py={1}
        mx={1}
        textTransform="uppercase"
      >
        {children}
      </ChakraLink>
    </Link>
  )
}

function Platform({ url, icon }) {
  return (
    <ChakraLink
      display="flex"
      href={url}
      px={2}
      py={1}
      borderRadius="sm"
      isExternal
    >
      <Icon
        as={icon}
        boxSize={6}
        color="gray.600"
        _hover={{ color: 'gray.500' }}
      />
    </ChakraLink>
  )
}

export default function Header() {
  return (
    <Flex
      as="header"
      bg="black"
      p={2}
      fontSize={{ base: 16, lg: 18 }}
      alignItems="center"
    >
      <Link href="/" passHref>
        <Icon
          as={LogoIcon}
          h={{ base: 8, lg: 12 }}
          w="auto"
          mr={{ base: 4, lg: 6 }}
          cursor="pointer"
        />
      </Link>
      <NavLink href="/">watch</NavLink>
      <NavLink href="/submit">submit</NavLink>
      <NavLink href="/streams">streams</NavLink>
      <NavLink href="/about">about</NavLink>
      <Spacer flex="1" />
      <HStack ml={2} spacing={2}>
        <Platform url="https://www.youtube.com/StayWOKE" icon={FaYoutube} />
        <Platform url="https://www.facebook.com/watchwoke" icon={FaFacebook} />
        <Platform url="https://www.twitch.tv/woke" icon={FaTwitch} />
        <Platform url="https://twitter.com/watchwoke" icon={FaTwitter} />
        <Platform url="https://www.periscope.tv/watchwoke" icon={FaPeriscope} />
        <Platform url="https://www.reddit.com/r/woke" icon={FaRedditAlien} />
        <Platform url="https://discord.gg/woke" icon={FaDiscord} />
      </HStack>
    </Flex>
  )
}
