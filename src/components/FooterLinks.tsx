import * as React from 'react'
import Link from 'next/link'
import { Link as ChakraLink, HStack } from '@chakra-ui/react'

function FooterLink({ href, children }) {
  return (
    <Link href={href} passHref>
      <ChakraLink
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

export const footerLinks = (
  <>
    <FooterLink href="/about">about</FooterLink>
    <FooterLink href="/engage">engage</FooterLink>
    <FooterLink href="/contact">contact</FooterLink>
    <FooterLink href="/rules">rules</FooterLink>
    <FooterLink href="/appeal">appeal</FooterLink>
    <FooterLink href="/report">DMCA</FooterLink>
  </>
)

export default function FooterLinks(
  props: React.ComponentProps<typeof HStack>,
) {
  return (
    <HStack
      flexShrink={0}
      spacing={4}
      px={4}
      h="14"
      bg="gray.950"
      color="orangeYellow.700"
      {...props}
    >
      {footerLinks}
    </HStack>
  )
}
