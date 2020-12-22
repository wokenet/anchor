import * as React from 'react'
import { Flex, Img, Text, useToken } from '@chakra-ui/react'
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
  // Note: we use as="div" below so the _odd styling relies on :nth-of-type, which requires all elements to have the same node name.
  return (
    <Text as="div" color="gray.200" {...props}>
      <Text display="inline" color={senderColor}>
        {sender}
      </Text>
      {': '}
      <MessageText display="inline">{body}</MessageText>
    </Text>
  )
}

export function ReplyMessage({
  body,
  sender,
  senderId,
  ...props
}: MessageProps) {
  const lines = body.split('\n')
  let quoteSenderId
  let quoteLines = []
  let line
  while ((line = lines.shift())) {
    if (line === '') {
      break
    }
    const match = line.match(/^>\s?\*?\s?(?:<([^>]+)>)?\s?(.*)/)
    if (!match) {
      continue
    }
    if (match[1]) {
      quoteSenderId = match[1]
    }
    quoteLines.push(match[2])
  }
  return (
    <Flex direction="column" flex="1" {...props}>
      <Flex fontSize="xs" mt={0.5} mb={-1} opacity=".75">
        <Text color="gray.200">re:&nbsp;</Text>
        <Message
          body={quoteLines.join('\n')}
          sender={quoteSenderId.substr(1).split(':')[0]}
          senderId={quoteSenderId}
        />
      </Flex>
      <Message body={lines.join('\n')} sender={sender} senderId={senderId} />
    </Flex>
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

  const body = content.body.substring(0, maximumMessageSize)

  if (content?.['m.relates_to']?.['m.in_reply_to']) {
    return (
      <ReplyMessage
        key={ev.event.event_id}
        sender={ev.sender.name}
        senderId={ev.sender.userId}
        body={body}
        px={4}
        _odd={{ backgroundColor: 'gray.900' }}
      />
    )
  }

  return (
    <Message
      key={ev.event.event_id}
      sender={ev.sender.name}
      senderId={ev.sender.userId}
      body={body}
      px={4}
      _odd={{ backgroundColor: 'gray.900' }}
    />
  )
}
