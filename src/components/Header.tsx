import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Flex,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Spacer,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaPeriscope,
  FaTwitch,
  FaDiscord,
  FaRedditAlien,
  FaBars,
} from 'react-icons/fa'

import LogoIcon from 'woke-content/images/logo.svg'
import MenuDrawer from './MenuDrawer'

type NavLinkProps = {
  href: string
  desktopOnly?: boolean
  children: React.ComponentProps<typeof ChakraLink>['children']
}

export function NavLink({ href, children }: NavLinkProps) {
  const { asPath } = useRouter()
  const isActive = asPath === href

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

export const secondaryHeaderLinks = (
  <>
    <NavLink href="/streams">streams</NavLink>
    <NavLink href="/videos">videos</NavLink>
    <NavLink href="/submit">submit</NavLink>
  </>
)

export const socialPlatforms = (
  <>
    <Platform url="https://www.youtube.com/StayWOKE" icon={FaYoutube} />
    <Platform url="https://www.facebook.com/watchwoke" icon={FaFacebook} />
    <Platform url="https://www.twitch.tv/woke" icon={FaTwitch} />
    <Platform url="https://twitter.com/watchwoke" icon={FaTwitter} />
    <Platform url="https://www.periscope.tv/watchwoke" icon={FaPeriscope} />
    <Platform url="https://www.reddit.com/r/woke" icon={FaRedditAlien} />
    <Platform url="https://discord.gg/woke" icon={FaDiscord} />
  </>
)

export default function Header(props: React.ComponentProps<typeof Flex>) {
  const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? true
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure()

  return (
    <Flex
      as="header"
      flexShrink={0}
      bg="black"
      p={2}
      fontSize={{ base: 16, lg: 18 }}
      alignItems="center"
      {...props}
    >
      <Link href="/" passHref>
        <ChakraLink tabIndex={-1} _focus={{ outline: 'none' }}>
          <Icon
            as={LogoIcon}
            h={{ base: 8, lg: 12 }}
            w="auto"
            mr={{ base: 4, lg: 6 }}
            cursor="pointer"
          />
        </ChakraLink>
      </Link>
      <HStack spacing="2">
        <NavLink href="/">watch</NavLink>
        <NavLink href="/streamers">streamers</NavLink>
        {isDesktop && secondaryHeaderLinks}
      </HStack>
      <Spacer flex="1" />
      {isDesktop && (
        <HStack ml={2} spacing={2}>
          {socialPlatforms}
        </HStack>
      )}
      {!isDesktop && (
        <>
          <IconButton
            variant="ghost"
            color="gray.400"
            icon={<FaBars />}
            fontSize="xl"
            aria-label="Show navigation"
            onClick={onMenuOpen}
          />
          <MenuDrawer isOpen={isMenuOpen} onClose={onMenuClose} />
        </>
      )}
    </Flex>
  )
}
