import * as React from 'react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { AspectRatio, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'

import Page from 'src/components/Page'

type Streamer = {
  id: string
  photo: string
  name: string
}

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
      <Flex
        role="group"
        alignItems="flex-end"
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
          fontSize="xl"
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

export default function StreamersPage({
  streamers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const streamersWithPhotos: Array<Streamer> = streamers.filter(
    (s) => !!s.photo,
  )
  return (
    <Page title="streamers">
      <SimpleGrid
        templateColumns="repeat(auto-fill, minmax(18rem, 1fr))"
        spacing={1}
        px={4}
        py={1}
      >
        {streamersWithPhotos.map((s) => (
          <StreamerTile key={s.id} streamer={s} />
        ))}
      </SimpleGrid>
    </Page>
  )
}

const STREAMERS_INDEX_URL = 'https://api.woke.net/streamers/index.json'

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(STREAMERS_INDEX_URL)
  const streamers = await res.json()

  return {
    revalidate: 60 * 10, // 10 minutes
    props: { streamers },
  }
}
