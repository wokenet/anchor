import * as React from 'react'
import { useState } from 'react'
import { AspectRatio, Box } from '@chakra-ui/react'

import Video from './Video'
import OfflinePlaceholder from './OfflinePlaceholder'
import { ViewData } from '../useAnchor'

type ViewProps = {
  view: ViewData
}
export default function View({ view: { kind, url, fill } }: ViewProps) {
  const [initialMuted, setInitialMuted] = useState(true)

  if (!url || kind === 'offline') {
    return <OfflinePlaceholder />
  }

  if (kind === 'hls') {
    return (
      <Video
        src={url}
        muted={initialMuted}
        onUnmute={() => setInitialMuted(false)}
      />
    )
  } else if (kind === 'embed') {
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
    const iframe = (
      <Box
        as="iframe"
        src={embedURL.toString()}
        width="full"
        height="full"
        allow="autoplay; picture-in-picture"
        allowFullScreen
      />
    )
    if (fill) {
      return iframe
    }
    return (
      <AspectRatio width="full" ratio={16 / 9}>
        {iframe}
      </AspectRatio>
    )
  }
}
