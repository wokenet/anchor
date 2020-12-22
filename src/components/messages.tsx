import * as React from 'react'
import { Img, Text, useToken } from '@chakra-ui/react'
import escapeStringRegexp from 'escape-string-regexp'

import { emoteSize, maximumMessageSize, botUserId } from '../../constants.json'
import { getSenderColor } from '../colors'
import { MatrixEvent } from 'matrix-js-sdk'

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

type MessageTextProps = React.ComponentProps<typeof Text> & {
  children: string
}

export function MessageText({ children, ...props }: MessageTextProps) {
  const parts = []
  for (const part of children.split(emoteRegexp)) {
    const emote = part.toLowerCase()
    if (emotes.has(emote)) {
      parts.push(<Emote key={parts.length} emote={emote} />)
    } else {
      parts.push(part)
    }
  }
  return <Text {...props}>{parts}</Text>
}

type MessageProps = React.ComponentProps<typeof Text> & {
  body: string
  senderId: string
  sender: string
}

export function Message({ body, sender, senderId, ...props }: MessageProps) {
  const baseSenderColor = useToken('colors', 'orangeYellow.500')
  const senderColor = getSenderColor(senderId, baseSenderColor)
  return (
    <Text color="gray.200" {...props}>
      <Text display="inline" color={senderColor}>
        {sender}
      </Text>
      {': '}
      <MessageText display="inline">{body}</MessageText>
    </Text>
  )
}

type BotNoticeProps = React.ComponentProps<typeof Text> & {
  body: string
  sender: string
}

export function BotNotice({ body, sender, ...props }: BotNoticeProps) {
  return (
    <MessageText
      color="orangeYellow.500"
      textAlign="center"
      borderColor="orangeYellow.600"
      borderStyle="solid"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      {...props}
    >
      {body}
    </MessageText>
  )
}

export function renderEvent(ev: MatrixEvent) {
  if (ev.getType() !== 'm.room.message' || !ev.event.content.body) {
    return
  }

  // @ts-ignore
  const content = ev.getContent()
  if (content?.msgtype === 'm.notice' && ev.sender.userId === botUserId) {
    return (
      <BotNotice
        key={ev.event.event_id}
        sender={ev.sender.name}
        body={content.body}
        px={4}
        py={2}
        my={2}
      />
    )
  }

  return (
    <Message
      key={ev.event.event_id}
      sender={ev.sender.name}
      senderId={ev.sender.userId}
      body={content.body.substring(0, maximumMessageSize)}
      px={4}
      _odd={{ backgroundColor: 'gray.900' }}
    />
  )
}
