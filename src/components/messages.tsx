import * as React from 'react'
import { Flex, Img, Text, useToken } from '@chakra-ui/react'
import escapeStringRegexp from 'escape-string-regexp'
import { ErrorBoundary } from 'react-error-boundary'

import { emoteSize, maxMessageSize, botUserId } from '../../constants.json'
import { getSenderColor } from '../colors'
import { MatrixEvent, RoomMember } from 'matrix-js-sdk'

import type { AnchorActions } from '../useAnchor'

function loadEmotes() {
  const emoteRequire = require.context(
    'woke-content/emotes/',
    false,
    /\.(png|gif)$/,
  )
  const emotes = new Map<string, string>(
    emoteRequire.keys().map((k) => {
      const emoteText = k.match(/^\.\/([\w-]+)\.\w+$/)[1]
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

export const { emotes, emoteRegexp } = loadEmotes()

export function Emote({ emote }: { emote: string }) {
  // TODO: implement https://github.com/Sorunome/matrix-doc/blob/b41c091dce3c29b3ade749f18d3350597a567512/proposals/2545-emotes.md
  return (
    <Img
      display="inline-block"
      src={emotes.get(emote)}
      width="1.5em"
      title={emote}
      verticalAlign="bottom"
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

type SenderProps = React.ComponentProps<typeof Text> & {
  senderId: string
  sender: string
}

function Sender({ sender, senderId, ...props }) {
  const baseSenderColor = useToken('colors', 'orangeYellow.500')
  const senderColor = getSenderColor(senderId, baseSenderColor)

  // Hide discord nick tag if present
  sender = sender.replace(/ \(discord\)$/, '')

  return (
    <Text as="span" color={senderColor} {...props}>
      {sender}
    </Text>
  )
}

type MessageProps = React.ComponentProps<typeof Text> & {
  body: string
  senderId: string
  sender: string
}

export function Message({ body, sender, senderId, ...props }: MessageProps) {
  // Note: we use as="div" below so the _odd styling relies on :nth-of-type, which requires all elements to have the same node name.
  return (
    <Text as="div" color="gray.200" {...props}>
      <Sender display="inline" sender={sender} senderId={senderId} />
      {': '}
      <MessageText display="inline">{body}</MessageText>
    </Text>
  )
}

type ImageMessageProps = React.ComponentProps<typeof Flex> & {
  senderId: string
  sender: string
  url: string
  imageWidth: number
  imageHeight: number
}

export function ImageMessage({
  sender,
  senderId,
  url,
  imageWidth,
  imageHeight,
  ...props
}: ImageMessageProps) {
  return (
    <Flex direction="column" flex="1" {...props}>
      <Text color="gray.200">
        <Sender display="inline" sender={sender} senderId={senderId} />:
      </Text>
      <Img src={url} htmlWidth={imageWidth} htmlHeight={imageHeight} mb={2} />
    </Flex>
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
}

export function BotNotice({ body, ...props }: BotNoticeProps) {
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

export function MessageFallback() {
  return (
    <Text as="div" color="gray.500" px={4}>
      Error displaying message.
    </Text>
  )
}

export function ChatEventContent({ ev, member, mxcURL }: ChatEventProps) {
  // @ts-ignore
  const content = ev.getContent()

  if (content?.msgtype === 'm.notice' && ev.sender.userId === botUserId) {
    return (
      <BotNotice
        sender={ev.sender.name}
        body={content.body}
        px={4}
        py={2}
        my={2}
      />
    )
  }

  if (content?.msgtype === 'm.image' && member.powerLevel > 10) {
    let imageURL, imageWidth, imageHeight
    if (content.info.thumbnail_url) {
      imageURL = content.info.thumbnail_url
      imageWidth = content.info.thumbnail_info.w
      imageHeight = content.info.thumbnail_info.h
    } else {
      imageURL = content.url
      imageWidth = content.info.w
      imageHeight = content.info.h
    }
    return (
      <ImageMessage
        sender={ev.sender.name}
        senderId={ev.sender.userId}
        url={mxcURL(imageURL)}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        px={4}
        _odd={{ backgroundColor: 'gray.900' }}
      />
    )
  }

  const body = content.body.substring(0, maxMessageSize)

  if (content?.['m.relates_to']?.['m.in_reply_to']) {
    return (
      <ReplyMessage
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
      sender={ev.sender.name}
      senderId={ev.sender.userId}
      body={body}
      px={4}
      _odd={{ backgroundColor: 'gray.900' }}
    />
  )
}

type ChatEventProps = {
  ev: MatrixEvent
  member: RoomMember
  mxcURL: AnchorActions['mxcURL']
}

export function ChatEvent({ ev, member, mxcURL }: ChatEventProps) {
  return (
    <ErrorBoundary FallbackComponent={MessageFallback}>
      <ChatEventContent ev={ev} member={member} mxcURL={mxcURL} />
    </ErrorBoundary>
  )
}
