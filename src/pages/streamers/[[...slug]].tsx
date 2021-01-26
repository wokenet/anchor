import * as React from 'react'
import { groupBy, keyBy } from 'lodash'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  AspectRatio,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import { FaLink } from 'react-icons/fa'

import type { Streamer } from '../../types'
import Page from 'src/components/Page'
import StreamerSupportIcons, {
  hasSupportLinks,
} from '../../components/StreamerSupportIcons'
import StreamerSocialIcons from '../../components/StreamerSocialIconsProps'

type StreamerTileProps = {
  streamer: Streamer
}

function StreamerTile({ streamer }: StreamerTileProps) {
  const [tileRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })
  return (
    <AspectRatio ref={tileRef} ratio={16 / 9}>
      <Link href={`/streamers/${streamer.slug}`} shallow passHref>
        <ChakraLink
          display="flex"
          role="group"
          alignItems="flex-end"
          justifyContent="flex-end"
          overflow="hidden"
          bgColor="black"
          bgImage={inView && `url(${streamer.photo})`}
          bgPosition="center"
          bgSize="cover"
          bgBlendMode="luminosity"
          cursor="pointer"
          transitionDuration="slow"
          _hover={{ bgColor: 'orangeYellow.700' }}
        >
          <Text
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            m={1}
            fontSize="lg"
            fontWeight="bold"
            borderRadius="4px"
            px={2}
            bg="rgba(0, 0, 0, .5)"
            userSelect="none"
            transitionDuration="slow"
            css={{ backdropFilter: 'blur(10px)' }}
            opacity="0"
            _groupHover={{ opacity: 1 }}
          >
            {streamer.name}
          </Text>
        </ChakraLink>
      </Link>
    </AspectRatio>
  )
}

type StreamerModalProps = {
  streamer: Streamer
  isOpen: boolean
  onClose: () => void
}

function StreamerModal({ streamer, isOpen, onClose }: StreamerModalProps) {
  return (
    <Modal
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      {streamer && (
        <ModalContent
          overflow="hidden"
          boxShadow="0 0 24px rgba(255, 255, 255, .2)"
        >
          <ModalCloseButton />
          <ModalBody p={0}>
            <Image src={streamer.photo} w="full" />
            <Flex flexDir="column" mx={6} my={6}>
              <Wrap spacing={4} mb={2}>
                <WrapItem my={0}>
                  <ChakraLink href={streamer.website} isExternal>
                    <Heading display="inline" color="orangeYellow.300">
                      {streamer.name}
                    </Heading>
                  </ChakraLink>
                </WrapItem>
                <WrapItem alignItems="center" my={0}>
                  <StreamerSocialIcons
                    streamer={streamer}
                    spacing={2}
                    fontSize="xl"
                  />
                </WrapItem>
              </Wrap>
              <VStack spacing={2} mt={2} alignItems="flex-start">
                <Wrap spacing={2} color="gray.500">
                  {streamer.creators?.length && (
                    <WrapItem>
                      <Text fontWeight="bold">
                        {streamer.creators.join(', ')}
                      </Text>
                    </WrapItem>
                  )}
                  {streamer.website && (
                    <WrapItem>
                      <ChakraLink
                        color="orangeYellow.300"
                        href={streamer.website}
                        isExternal
                      >
                        <Icon as={FaLink} mr={1} />
                        website
                      </ChakraLink>
                    </WrapItem>
                  )}
                  <WrapItem>
                    {streamer.home && <Text>{streamer.home}</Text>}
                  </WrapItem>
                </Wrap>
                {streamer.info && <Text my={1}>{streamer.info}</Text>}
                {streamer.teams && (
                  <Wrap spacing={1}>
                    {streamer.teams.map((t) => (
                      <WrapItem key={t}>
                        <Tag
                          bg="orangeYellow.400"
                          color="orangeYellow.800"
                          px={2}
                          borderRadius="4px"
                          opacity=".75"
                        >
                          {t}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
                {streamer.cities && streamer.cities.length > 1 && (
                  <Wrap spacing={1}>
                    {streamer.cities.map((c) => (
                      <WrapItem key={c}>
                        <Tag
                          bg="gray.600"
                          px={2}
                          borderRadius="4px"
                          opacity=".75"
                        >
                          {c}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
              </VStack>
              {hasSupportLinks(streamer) && (
                <>
                  <Divider pt={4} />
                  <ModalFooter
                    color="flame.300"
                    alignItems="center"
                    justifyContent="flex-start"
                    px={0}
                    pb={0}
                  >
                    <Heading as="h3" size="md" display="inline">
                      Support {streamer.name}:
                    </Heading>
                    <StreamerSupportIcons
                      streamer={streamer}
                      ml={4}
                      spacing={3}
                      fontSize="2rem"
                    />
                  </ModalFooter>
                </>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  )
}

// InferGetStaticPropsType types streamerMap as unknown :(
type StreamersPageProps = {
  streamerMap: { [k: string]: Streamer }
}
export default function StreamersPage({ streamerMap }: StreamersPageProps) {
  const router = useRouter()
  const { slug } = router.query
  const selectedStreamer =
    slug &&
    slug.length === 1 &&
    streamerMap.hasOwnProperty(slug[0]) &&
    streamerMap[slug[0]]
  const streamers = [...Object.values(streamerMap)]
  const streamersByType = groupBy(streamers, (s) => s.type)
  return (
    <Page
      title={
        (selectedStreamer ? selectedStreamer.name + ' – ' : '') + 'streamers'
      }
      description={selectedStreamer?.info}
      socialImage={selectedStreamer?.photo}
    >
      <StreamerModal
        streamer={selectedStreamer}
        isOpen={!!selectedStreamer}
        onClose={() => router.push('/streamers', undefined, { shallow: true })}
      />
      <SimpleGrid
        templateColumns="repeat(auto-fill, minmax(18rem, 1fr))"
        spacing={1}
        px={4}
        py={1}
      >
        {streamersByType['Individual'].map((s) => (
          <StreamerTile key={s.id} streamer={s} />
        ))}
        {streamersByType['Collective'].map((s) => (
          <StreamerTile key={s.id} streamer={s} />
        ))}
      </SimpleGrid>
    </Page>
  )
}

const STREAMERS_INDEX_URL = 'https://api.woke.net/streamers/index.json'

async function getStreamers() {
  const res = await fetch(STREAMERS_INDEX_URL)
  const streamers: Array<Streamer> = await res.json()
  return streamers
}

export async function getStaticPaths() {
  const streamers = await getStreamers()

  const paths = streamers.map((s) => ({
    params: { slug: [s.slug] },
  }))

  paths.push({ params: { slug: null } })

  return { paths, fallback: false }
}
export const getStaticProps: GetStaticProps = async () => {
  const streamers = await getStreamers()
  const streamerMap = keyBy(streamers, (s) => s.slug)

  return {
    revalidate: 60 * 10, // 10 minutes
    props: { streamerMap },
  }
}
