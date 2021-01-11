import * as React from 'react'
import { useCallback, useRef, useState } from 'react'
import {
  Icon,
  IconButton,
  SimpleGrid,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
} from '@chakra-ui/react'
import { throttle } from 'lodash'
import { FaSearch } from 'react-icons/fa'

import { emoteSize } from '../../constants.json'
import Scrollbars from './Scrollbars'
import { emotes } from './messages'

type EmotePickerProps = {
  onClose: () => void
  onPickEmote: (string) => void
} & React.ComponentProps<typeof Flex>

const allEmotes = Array.from(emotes.keys())

export default function EmotePicker({
  onClose,
  onPickEmote,
  ...props
}: EmotePickerProps) {
  const emoteFilterRef = useRef<HTMLInputElement>()
  const [shownEmotes, setShownEmotes] = useState(allEmotes)

  const handleChangeFilter = useCallback(
    throttle((ev) => {
      const filter = ev.target.value
      if (!filter) {
        setShownEmotes(allEmotes)
        return
      }

      // TODO: use a trie to improve perf when the emote count gets large.
      setShownEmotes(allEmotes.filter((k) => k.includes(filter)))
    }),
    [],
  )

  function handleKeyDown(ev: React.KeyboardEvent) {
    if (ev.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Flex flexDir="column" {...props}>
      <InputGroup size="sm" w="auto" mx={4} mt={1} mb={1}>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FaSearch} color="gray.300" />}
        />
        <Input
          ref={emoteFilterRef}
          variant="flushed"
          color="gray.300"
          focusBorderColor="gray.600"
          placeholder="Find an emote"
          onChange={handleChangeFilter}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </InputGroup>
      <Scrollbars autoHide={false}>
        <SimpleGrid
          templateColumns="repeat(auto-fill, minmax(2.15rem, 1fr))"
          spacing={1}
          px={4}
          py={1}
        >
          {shownEmotes.map((emote) => (
            <IconButton
              key={emote}
              icon={<Img src={emotes.get(emote)} width={`${emoteSize}px`} />}
              variant="ghost"
              boxSize="2.15rem"
              minW={0}
              aria-label={emote}
              title={emote}
              onClick={() => onPickEmote(emote)}
            />
          ))}
        </SimpleGrid>
      </Scrollbars>
    </Flex>
  )
}
