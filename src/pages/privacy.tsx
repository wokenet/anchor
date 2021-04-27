import * as React from 'react'
import Link from 'next/link'
import { Center, Heading, Link as ChakraLink, Text } from '@chakra-ui/react'

import Page from '../components/Page'
import Rules from '../components/Privacy'

export default function RulesPage() {
  return (
    <Page title="Privacy Policy">
      <Center color="gray.200" flex="1 0 auto" flexDirection="column" mt={8}>
        <Heading as="h1" size="lg">
        Privacy Policy
        </Heading>
        <Text maxW="xl" px={8} my={4} color="gray.300">
        TOPEYE INC built the WOKE app as a Free app. This SERVICE is provided by TOPEYE INC at no cost and is intended for use as is.
        </Text>
        <Rules maxW="xl" bg="gray.700" px={8} py={6} mb={0} />
        <Text maxW="xl" px={8} my={4} color="gray.300">
If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at {' '}
          <Link href="/contact" passHref>
            <ChakraLink color="orangeYellow.600">app@woke.net</ChakraLink>
          </Link>
        </Text>
      </Center>
    </Page>
  )
}
