import * as React from 'react'
import { kebabCase, keyBy } from 'lodash'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import {
  AspectRatio,
  Divider,
  Flex,
  Heading,
  HStack,
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
import {
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPeriscope,
  FaTwitch,
  FaLink,
  FaPaypal,
  FaPatreon,
  FaGlasses,
} from 'react-icons/fa'
import { IoLogoVenmo } from 'react-icons/io5'
import { SiCashapp } from 'react-icons/si'

import Page from 'src/components/Page'

type Streamer = {
  id: string
  photo: string
  name: string
  info: string
  home?: string
  creators?: Array<string>
  teams?: Array<string>
  cities: Array<string>
  website?: string
  facebook?: string
  youtube?: string
  twitch?: string
  twitter?: string
  instagram?: string
  periscope?: string
  cashapp?: string
  paypal?: string
  venmo?: string
  patreon?: string
  streamlabs?: string
}

type StreamerTileProps = {
  streamer: Streamer
  onClick: () => void
}

function StreamerTile({ streamer, onClick }: StreamerTileProps) {
  const [tileRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })
  return (
    <AspectRatio ref={tileRef} ratio={16 / 9}>
      <Flex
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
        onClick={onClick}
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
      </Flex>
    </AspectRatio>
  )
}

type StreamerModalProps = {
  streamer: Streamer
  isOpen: boolean
  onClose: () => void
}

function StreamerModal({ streamer, isOpen, onClose }: StreamerModalProps) {
  const hasSupportLinks =
    streamer?.cashapp ||
    streamer?.paypal ||
    streamer?.venmo ||
    streamer?.patreon ||
    streamer?.streamlabs
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
                  <HStack spacing={2} fontSize="xl">
                    {streamer.facebook && (
                      <ChakraLink href={streamer.facebook} isExternal>
                        <Icon as={FaFacebook} />
                      </ChakraLink>
                    )}
                    {streamer.youtube && (
                      <ChakraLink href={streamer.youtube} isExternal>
                        <Icon as={FaYoutube} />
                      </ChakraLink>
                    )}
                    {streamer.twitch && (
                      <ChakraLink href={streamer.twitch} isExternal>
                        <Icon as={FaTwitch} />
                      </ChakraLink>
                    )}
                    {streamer.twitter && (
                      <ChakraLink href={streamer.twitter} isExternal>
                        <Icon as={FaTwitter} />
                      </ChakraLink>
                    )}
                    {streamer.instagram && (
                      <ChakraLink href={streamer.instagram} isExternal>
                        <Icon as={FaInstagram} />
                      </ChakraLink>
                    )}
                    {streamer.periscope && (
                      <ChakraLink href={streamer.periscope} isExternal>
                        <Icon as={FaPeriscope} />
                      </ChakraLink>
                    )}
                  </HStack>
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
                {streamer.teams && streamer.teams.length > 1 && (
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
              {hasSupportLinks && (
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
                    <HStack ml={4} spacing={3} fontSize="2rem">
                      {streamer.cashapp && (
                        <ChakraLink
                          display="flex"
                          href={streamer.cashapp}
                          isExternal
                        >
                          <Icon as={SiCashapp} />
                        </ChakraLink>
                      )}
                      {streamer.paypal && (
                        <ChakraLink
                          display="flex"
                          href={streamer.paypal}
                          isExternal
                        >
                          <Icon as={FaPaypal} />
                        </ChakraLink>
                      )}
                      {streamer.venmo && (
                        <ChakraLink
                          display="flex"
                          href={streamer.venmo}
                          isExternal
                        >
                          <Icon as={IoLogoVenmo} />
                        </ChakraLink>
                      )}
                      {streamer.patreon && (
                        <ChakraLink
                          display="flex"
                          href={streamer.patreon}
                          isExternal
                        >
                          <Icon as={FaPatreon} />
                        </ChakraLink>
                      )}
                      {streamer.streamlabs && (
                        <ChakraLink
                          display="flex"
                          href={streamer.streamlabs}
                          isExternal
                        >
                          <Icon as={FaGlasses} />
                        </ChakraLink>
                      )}
                    </HStack>
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

export default function StreamersPage({
  streamerMap,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const { slug } = router.query
  const selectedStreamer =
    streamerMap.hasOwnProperty(slug) && streamerMap[slug[0]]
  return (
    <Page title="streamers">
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
        {Array.from(
          Object.entries(streamerMap),
          ([slug, s]: [string, Streamer]) => (
            <StreamerTile
              key={s.id}
              streamer={s}
              onClick={() =>
                router.push(`/streamers/${slug}`, undefined, { shallow: true })
              }
            />
          ),
        )}
      </SimpleGrid>
    </Page>
  )
}

const STREAMERS_INDEX_URL = 'https://api.woke.net/streamers/index.json'

async function getStreamers() {
  const res = await fetch(STREAMERS_INDEX_URL)
  const streamers: Array<Streamer> = await res.json()
  const streamersWithPhotos = streamers.filter((s) => !!s.photo)
  return streamersWithPhotos
}

export async function getStaticPaths() {
  const streamers = await getStreamers()

  const paths = streamers.map((s) => ({
    params: { slug: [kebabCase(s.name)] },
  }))

  paths.push({ params: { slug: null } })

  return { paths, fallback: false }
}
export const getStaticProps: GetStaticProps = async () => {
  const streamers = await getStreamers()
  const streamerMap = keyBy(streamers, (s) => kebabCase(s.name))

  return {
    revalidate: 60 * 10, // 10 minutes
    props: { streamerMap },
  }
}
