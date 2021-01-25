import * as React from 'react'
import { HStack, Icon, Link as ChakraLink } from '@chakra-ui/react'
import { FaPaypal, FaPatreon, FaGlasses } from 'react-icons/fa'
import { IoLogoVenmo } from 'react-icons/io5'
import { SiCashapp } from 'react-icons/si'
import { Streamer } from '../types'

export function hasSupportLinks(streamer: Streamer) {
  return (
    streamer?.cashapp ||
    streamer?.paypal ||
    streamer?.venmo ||
    streamer?.patreon ||
    streamer?.streamlabs
  )
}

type StreamerSupportIconsProps = {
  streamer: Streamer
} & React.ComponentProps<typeof HStack>

export default function StreamerSupportIcons({
  streamer,
  ...props
}: StreamerSupportIconsProps) {
  return (
    <HStack {...props}>
      {streamer.cashapp && (
        <ChakraLink display="flex" href={streamer.cashapp} isExternal>
          <Icon as={SiCashapp} />
        </ChakraLink>
      )}
      {streamer.paypal && (
        <ChakraLink display="flex" href={streamer.paypal} isExternal>
          <Icon as={FaPaypal} />
        </ChakraLink>
      )}
      {streamer.venmo && (
        <ChakraLink display="flex" href={streamer.venmo} isExternal>
          <Icon as={IoLogoVenmo} />
        </ChakraLink>
      )}
      {streamer.patreon && (
        <ChakraLink display="flex" href={streamer.patreon} isExternal>
          <Icon as={FaPatreon} />
        </ChakraLink>
      )}
      {streamer.streamlabs && (
        <ChakraLink display="flex" href={streamer.streamlabs} isExternal>
          <Icon as={FaGlasses} />
        </ChakraLink>
      )}
    </HStack>
  )
}
