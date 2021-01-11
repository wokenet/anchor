import * as React from 'react'
import { useCallback, useRef, useState } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Icon,
  IconButton,
  Portal,
  SimpleGrid,
  Tooltip,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { throttle } from 'lodash'
import { AiFillSmile } from 'react-icons/ai'
import { FaSearch } from 'react-icons/fa'

import { emoteSize } from '../../constants.json'
import Scrollbars from './Scrollbars'
import { emotes } from './messages'

type EmotePickerProps = {
  onPickEmote: (string) => void
} & React.ComponentProps<typeof IconButton>

const allEmotes = Array.from(emotes.keys())

export default function EmotePicker({
  isOpen,
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

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="top-end"
      gutter={10}
      variant="responsive"
      initialFocusRef={emoteFilterRef}
      returnFocusOnClose={false}
    >
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Icon as={AiFillSmile} color="gray.200" />}
          fontSize="1.5rem"
          {...props}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          w={{ base: 'calc(100vw - 1.5rem)', sm: '22.5rem' }}
          h="15rem"
          _focus={{ outline: 'none' }}
        >
          <PopoverBody display="flex" flexDir="column" height="full" p={0}>
            <InputGroup size="sm" w="auto" mx={2} mt={1} mb={1}>
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
                autoFocus
              />
            </InputGroup>
            <Scrollbars autoHide={false}>
              <SimpleGrid
                templateColumns="repeat(auto-fill, minmax(2.15rem, 1fr))"
                spacing={1}
                p={2}
                pt={1}
              >
                {shownEmotes.map((emote) => (
                  <IconButton
                    key={emote}
                    icon={
                      <Img src={emotes.get(emote)} width={`${emoteSize}px`} />
                    }
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
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
