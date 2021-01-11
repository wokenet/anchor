import * as React from 'react'
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
} from '@chakra-ui/react'
import { AiFillSmile } from 'react-icons/ai'

import { emoteSize } from '../../constants.json'
import Scrollbars from './Scrollbars'
import { emotes } from './messages'

type EmotePickerProps = {
  onPickEmote: (string) => void
} & React.ComponentProps<typeof IconButton>

export default function EmotePicker({
  isOpen,
  onClose,
  onPickEmote,
  ...props
}: EmotePickerProps) {
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="top-end"
      gutter={10}
      variant="responsive"
      returnFocusOnClose={false}
      autoFocus
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
            <Scrollbars autoHide={false}>
              <SimpleGrid
                templateColumns="repeat(auto-fill, minmax(2.15rem, 1fr))"
                spacing={1}
                p={2}
              >
                {Array.from(emotes.keys(), (emote) => (
                  <IconButton
                    icon={
                      <Img src={emotes.get(emote)} boxSize={`${emoteSize}px`} />
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
