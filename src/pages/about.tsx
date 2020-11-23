import * as React from 'react'
import {
  Box,
  Container,
  Divider,
  Icon,
  Flex,
  Link,
  Text,
  Stack,
  VStack,
  Heading,
} from '@chakra-ui/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Papa from 'papaparse'
import camelCase from 'lodash/camelCase'

import WokeSticker from 'woke-content/images/woke-4x6.svg'
import Page from 'src/components/Page'

const LEDGER_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiTpYFeMBAzabZ1BxB0RJfrtJFPReyS9zlhAJP14Xd_3T5TJHAF5jjJsLO1lC33qbdetzCUaU84B_Y/pub?gid=0&single=true&output=csv'

export const getStaticProps: GetStaticProps = async () => {
  let ledger = null
  const res = await fetch(LEDGER_CSV_URL)
  const csv = await res.text()
  if (csv) {
    const ledgerData = await Papa.parse(csv, {
      header: true,
      transformHeader: camelCase,
    })
    ledger = ledgerData?.data?.filter((row) => row.category)
  }

  return {
    revalidate: 60 * 60 * 8, // 8 hours
    props: { ledger },
  }
}

function Repo({ name, url, children }) {
  return (
    <Flex
      flexDirection={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
    >
      <Link
        as="h3"
        size="md"
        width={{ base: 'auto', lg: 32 }}
        href={url}
        isExternal
      >
        {name}
      </Link>
      <Flex direction="column" color="gray.400">
        <Box>{children}</Box>
        <Box>
          <Link href={url} color="orangeYellow.500" isExternal>
            {url.split('https://')[1]}
          </Link>
        </Box>
      </Flex>
    </Flex>
  )
}

function LedgerRow({ category, date, description, amount, currentBalance }) {
  const toNum = (text) => Number(text.replace(/[^\d-]/g, ''))
  return (
    <Flex flexDirection={{ base: 'column', lg: 'row' }} w="full">
      <Flex alignItems="center">
        <Flex w="6rem">
          {date && (
            <Text color="gray.300" mr={2}>
              {date}:
            </Text>
          )}
        </Flex>
        <Flex w="9rem">
          <Text
            color="gray.300"
            borderColor="gray.600"
            borderWidth="1px"
            borderStyle="solid"
            borderRadius="sm"
            px={1}
            ml={1}
          >
            {category}
          </Text>
        </Flex>
      </Flex>
      <Text flex="1">{description}</Text>
      <Flex alignSelf="flex-end">
        <Text
          mr={2}
          color={toNum(amount) >= 0 ? 'gray.200' : 'deepRed.300'}
          w="6rem"
          textAlign="right"
        >
          {amount}
        </Text>
        <Text
          color={toNum(currentBalance) >= 0 ? 'gray.200' : 'deepRed.300'}
          w="6rem"
          textAlign="right"
        >
          {currentBalance}
        </Text>
      </Flex>
    </Flex>
  )
}

export default function AboutPage({
  ledger,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="about">
      <Container color="gray.200" maxW="52rem" mt={8}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          alignItems="center"
          spacing={4}
        >
          <Icon as={WokeSticker} w="auto" h="24rem" />
          <VStack>
            <Text fontSize="xl">
              <strong>WOKE</strong> is a digital collective on a mission to
              amplify voices that otherwise go unheard around the world. Our
              shared journey is in the pursuit of truth, knowledge and
              understanding.
            </Text>
            <Text>
              Our intention with the WOKE NETWORK is to provide humans direct
              and unfiltered access to the live and unfiltered views of other
              humans across the world, as events occur it’s more important than
              ever to have the most perspective possible to make an accurate and
              informed decision. The world has never been presented with a
              resource quite like this before.
            </Text>
            <Text>
              We are still a very new community, every day our ambition is to
              reflect and grow towards bettering ourselves and improving our
              individual contributions as the project evolves over this historic
              and uncertain period of our modern human history.
            </Text>
          </VStack>
        </Stack>
        <Divider my={4} />
        <Heading as="h2" size="lg" mt={8} mb={4}>
          Open Technology
        </Heading>
        <Text>
          We build custom tools to operate our stream and website and distribute
          them free to all:
        </Text>
        <VStack spacing={4} my={4} alignItems="flex-start">
          <Repo name="Anchor" url="https://github.com/wokenet/anchor">
            This website: a realtime streaming community platform powered by{' '}
            <Link href="https://matrix.org">Matrix</Link>.
          </Repo>
          <Repo
            name="Streamwall"
            url="https://github.com/streamwall/streamwall"
          >
            Our grid of livestreams, with a web interface for collaborative
            curation.
          </Repo>
          <Repo
            name="Streamdelay"
            url="https://github.com/streamwall/streamdelay"
          >
            Livestream "
            <Link href="https://en.wikipedia.org/wiki/Broadcast_delay">
              broadcast delay
            </Link>
            " to censor gore and personal information.
          </Repo>
        </VStack>
        <Heading as="h2" size="lg" mt={8} mb={4}>
          Transparent Finances
        </Heading>
        <VStack spacing={2} my={4} alignItems="flex-start" fontSize="sm">
          {ledger ? (
            ledger.map((row) => <LedgerRow {...row} />)
          ) : (
            <Text>Error loading ledger data.</Text>
          )}
        </VStack>
      </Container>
    </Page>
  )
}
