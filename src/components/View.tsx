import * as React from 'react'
import { useState } from 'react'
import { AspectRatio, chakra } from '@chakra-ui/react'

import Video from './Video'
import { ViewData } from '../useAnchor'

const IframeEl = chakra('iframe')

type ViewProps = {
  view: ViewData
  isMuted: boolean
}
export default function View({
  view: { kind, url, fill },
  isMuted,
}: ViewProps) {
  const [initialMuted] = useState(isMuted)
  if (kind === 'hls') {
    return <Video src={url} width="full" muted={isMuted} />
  } else if (kind === 'embed') {
    let embedURL: URL
    try {
      embedURL = new URL(url)
    } catch (err) {
      return
    }
    if (embedURL.hostname === 'www.youtube.com') {
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
      <IframeEl
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