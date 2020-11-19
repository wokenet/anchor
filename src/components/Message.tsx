import * as React from 'react'
import { Img, Text } from '@chakra-ui/react'

import { emoteSize } from '../../constants.json'

const emoteRequire = require.context('woke-content/emotes/', false, /\.png$/)
const emotes = new Map<string, string>(
  emoteRequire.keys().map((k) => {
    const emoteText = k.match(/^\.\/(\w+)\.png$/)[1]
    return [emoteText.toLowerCase(), emoteRequire(k).default]
  }),
)
const emoteNames = Array.from(emotes.keys())
const emoteRegexp = new RegExp(
  '(' + emoteNames.map((k) => `:${k}:`).join('|') + ')',
  'i',
)

type MessageProps = React.ComponentProps<typeof Text> & {
  body: string
  sender: string
}

export function Emote({ emote }: { emote: string }) {
  return (
    <Img
      display="inline-block"
      src={emotes.get(emote)}
      boxSize={emoteSize + 'px'}
      title={`:${emote}:`}
    />
  )
}

export default function Message({ body, sender, ...props }: MessageProps) {
  const parts = []
  for (const part of body.split(emoteRegexp)) {
    const emote = part.substring(1, part.length - 1).toLowerCase()
    if (emotes.has(emote)) {
      parts.push(<Emote key={parts.length} emote={emote} />)
    } else {
      parts.push(part)
    }
  }
  return (
    <Text {...props}>
      {sender}: {parts}
    </Text>
  )
}
