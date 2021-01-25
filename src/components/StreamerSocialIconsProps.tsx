import * as React from 'react'
import { HStack, Icon, Link as ChakraLink } from '@chakra-ui/react'
import {
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPeriscope,
  FaTwitch,
} from 'react-icons/fa'
import { Streamer } from '../types'

type StreamerSocialIconsProps = {
  streamer: Streamer
} & React.ComponentProps<typeof HStack>

export default function StreamerSocialIcons({
  streamer,
  ...props
}: StreamerSocialIconsProps) {
  return (
    <HStack {...props}>
      {streamer.facebook && (
        <ChakraLink href={streamer.facebook} isExternal>
          <Icon as={FaFacebook} />
        </ChakraLink>
      )}
      {streamer.youtube && (
        <ChakraLink href={streamer.youtube} isExternal>
          <Icon as={FaYoutube} />
        </ChakraLink>
      )}
      {streamer.twitch && (
        <ChakraLink href={streamer.twitch} isExternal>
          <Icon as={FaTwitch} />
        </ChakraLink>
      )}
      {streamer.twitter && (
        <ChakraLink href={streamer.twitter} isExternal>
          <Icon as={FaTwitter} />
        </ChakraLink>
      )}
      {streamer.instagram && (
        <ChakraLink href={streamer.instagram} isExternal>
          <Icon as={FaInstagram} />
        </ChakraLink>
      )}
      {streamer.periscope && (
        <ChakraLink href={streamer.periscope} isExternal>
          <Icon as={FaPeriscope} />
        </ChakraLink>
      )}
    </HStack>
  )
}
