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
    <HStack flexShrink={0} spacing={6} px={4} h="14" bg="gray.950" {...props}>
      <FooterLink href="/contact">contact</FooterLink>
      <FooterLink href="/engage">engage</FooterLink>
      <FooterLink href="/report">DMCA</FooterLink>
    </HStack>
  )
}
