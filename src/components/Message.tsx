import * as React from 'react'
import { Img, Text, useToken } from '@chakra-ui/react'
import escapeStringRegexp from 'escape-string-regexp'

import { emoteSize } from '../../constants.json'
import { getSenderColor } from '../colors'

function loadEmotes() {
  const emoteRequire = require.context(
    'woke-content/emotes/',
    false,
    /\.(png|gif)$/,
  )
  const emotes = new Map<string, string>(
    emoteRequire.keys().map((k) => {
      const emoteText = k.match(/^\.\/(\w+)\.\w+$/)[1]
      return [':' + emoteText.toLowerCase() + ':', emoteRequire(k).default]
    }),
  )

  const emoteAliases: {
    [key: string]: string
  } = require('woke-content/emotes/aliases.json')
  for (const [alias, emote] of Object.entries(emoteAliases)) {
    if (!emotes.has(emote)) {
      console.warn('Unknown emote alias', alias, emote)
      continue
    }
    emotes.set(alias, emotes.get(emote))
  }

  const emoteNames = Array.from(emotes.keys()).map(escapeStringRegexp)
  const emoteRegexp = new RegExp('(' + emoteNames.join('|') + ')', 'i')

  return { emotes, emoteRegexp }
}

const { emotes, emoteRegexp } = loadEmotes()

type MessageProps = React.ComponentProps<typeof Text> & {
  body: string
  senderId: string
  sender: string
}

export function Emote({ emote }: { emote: string }) {
  // TODO: implement https://github.com/Sorunome/matrix-doc/blob/b41c091dce3c29b3ade749f18d3350597a567512/proposals/2545-emotes.md
  return (
    <Img
      display="inline-block"
      src={emotes.get(emote)}
      boxSize={emoteSize + 'px'}
      title={emote}
    />
  )
}

export default function Message({ body, sender, ...props }: MessageProps) {
  const baseSenderColor = useToken('colors', 'orangeYellow.500')
  const senderColor = getSenderColor(sender, baseSenderColor)

  const parts = []
  for (const part of body.split(emoteRegexp)) {
    const emote = part.toLowerCase()
    if (emotes.has(emote)) {
      parts.push(<Emote key={parts.length} emote={emote} />)
    } else {
      parts.push(part)
    }
  }

  return (
    <Text color="gray.200" {...props}>
      <Text display="inline" color={senderColor}>
        {sender}
      </Text>
      {': '}
      {parts}
    </Text>
  )
}
