import * as React from 'react'
import Link from 'next/link'
import { Center, Heading, Link as ChakraLink, Text } from '@chakra-ui/react'

import Page from '../components/Page'
import Rules from '../components/Rules'

export default function RulesPage() {
  return (
    <Page title="Community Rules">
      <Center color="gray.200" flex="1 0 auto" flexDirection="column" mt={8}>
        <Heading as="h1" size="lg">
          Community Rules
        </Heading>
        <Text maxW="xl" px={8} my={4} color="gray.300">
          Hey, this is important! To participate in WOKE.NET, you must follow
          these ground rules:
        </Text>
        <Rules maxW="xl" bg="gray.700" px={8} py={6} mb={0} />
        <Text maxW="xl" px={8} my={4} color="gray.300">
          Repeat violators will be permanently banned from participating in any
          of our communities. If you believe you were banned in error, see our{' '}
          <Link href="/appeal" passHref>
            <ChakraLink color="orangeYellow.600">ban appeal form</ChakraLink>
          </Link>
          .
        </Text>
      </Center>
    </Page>
  )
}
