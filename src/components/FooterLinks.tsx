import * as React from 'react'
import Link from 'next/link'
import { Link as ChakraLink, HStack } from '@chakra-ui/react'

function FooterLink({ href, children }) {
  return (
    <Link href={href} passHref>
      <ChakraLink
        color="orangeYellow.800"
        fontFamily="Oswald"
        fontSize="sm"
        px={2}
        py={1}
        borderRadius="sm"
        _hover={{
          color: 'orangeYellow.600',
          textDecoration: 'none',
        }}
        textTransform="uppercase"
      >
        {children}
      </ChakraLink>
    </Link>
  )
}

export default function FooterLinks(
  props: React.ComponentProps<typeof HStack>,
) {
  return (
    <HStack flexShrink={0} spacing={4} px={4} h="14" bg="gray.950" {...props}>
      <FooterLink href="/about">about</FooterLink>
      <FooterLink href="/contact">contact</FooterLink>
      <FooterLink href="/report">DMCA</FooterLink>
      <FooterLink href="/appeal">appeal</FooterLink>
    </HStack>
  )
}
