import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Flex, Icon, Link as ChakraLink } from '@chakra-ui/react'

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

type PageProps = {
  title?: string
  children: React.ReactNode
}
export default function Page({ title, children }: PageProps) {
  return (
    <>
      <Head>
        <title>
          {title && title.toUpperCase()}
          {title ? ' – ' : ''}WOKE.NET
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/static/eye112.png"></link>
      </Head>
      <Flex direction="column" width="100vw" height="100vh" overflow="hidden">
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
        </Flex>
        <Flex flex={1} flexDirection="column" overflow="auto">
          {children}
        </Flex>
      </Flex>
    </>
  )
}
