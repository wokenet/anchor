import * as React from 'react'
import { useState } from 'react'
import { AspectRatio, Box, useBreakpointValue } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

import OfflinePlaceholder from './OfflinePlaceholder'
import { ViewData } from '../useAnchor'

const Video = dynamic(() => import('./Video'), {
  ssr: false,
})

type ViewProps = {
  view: ViewData
}
export default function View({ view }: ViewProps) {
  let fill = false
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const [initialMuted, setInitialMuted] = useState(true)

  // HAX
  view = {
    kind: 'live',
    dash: 'https://get.woke.net/live/dash.mpd',
    hls: 'https://get.woke.net/live/hls.m3u8',
  } as ViewData

  let content
  if (view.kind === 'offline') {
    fill = true
    content = <OfflinePlaceholder />
  } else if (view.kind === 'live') {
    content = (
      <Video
        dash={view.dash}
        hls={view.hls}
        muted={initialMuted}
        onUnmute={() => setInitialMuted(false)}
      />
    )
  } else if (view.kind === 'embed') {
    const { url } = view
    fill = view.fill
    let embedURL: URL
    try {
      embedURL = new URL(url)
    } catch (err) {
      return <Box />
    }
    if (embedURL.hostname === 'www.youtube.com') {
      if (!embedURL.pathname.startsWith('/embed')) {
        embedURL = new URL(
          `https://www.youtube.com/embed/${embedURL.searchParams.get('v')}`,
        )
      }
      embedURL.searchParams.set('autoplay', '1')
      // To get the iframe to start playing we need to mute on page load.
      // TODO: use a play button
      if (initialMuted) {
        embedURL.searchParams.set('mute', '1')
      }
    } else if (embedURL.hostname.endsWith('twitch.tv')) {
      if (embedURL.hostname === 'www.twitch.tv') {
        embedURL = new URL(
          `https://player.twitch.tv?channel=${embedURL.pathname.substr(1)}`,
        )
      }
      if (embedURL.hostname === 'player.twitch.tv') {
        embedURL.searchParams.set('parent', location.hostname)
      }
    } else if (embedURL.hostname === 'www.facebook.com') {
      if (!embedURL.pathname.startsWith('/plugins/video.php')) {
        embedURL = new URL(
          `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
            embedURL.toString(),
          )}`,
        )

        embedURL.searchParams.set('show_text', 'false')
      }
    }
    content = (
      <Box
        as="iframe"
        src={embedURL.toString()}
        width="full"
        height="full"
        allow="autoplay; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (isDesktop && fill) {
    return content
  }

  return (
    <AspectRatio width="full" maxHeight="full" ratio={16 / 9}>
      {content}
    </AspectRatio>
  )
}
