import * as React from 'react'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'

function Rule({ title, children }) {
  return (
    <Box>
      <Heading as="h2" color="flame.400" size="sm">
        {title}
      </Heading>
      <Text>{children}</Text>
    </Box>
  )
}

export default function Rules(props: React.ComponentProps<typeof VStack>) {
  return (
    <VStack alignItems="flex-start" mb={2} spacing={4} {...props}>
      <Rule title="No Hate Speech.">
        No inciting/condoning/supporting any forms of violence.
      </Rule>
      <Rule title="Treat developing situations with care.">
        Please do not speculate on any alleged victims/offenders information out
        of respect.
      </Rule>
      <Rule title="Don’t be rude.">
        Treat each other with kindness. Refrain from needless insults and/or
        personal attacks.
      </Rule>
      <Rule title="Avoid sweeping generalizations.">
        This includes people of any religion, belief, system, political party,
        etc.
      </Rule>
      <Rule title="Do not impersonate.">
        Do not pretend to be other members of the community.
      </Rule>
      <Rule title="Respect privacy.">
        Absolutely no doxing will be tolerated including the posting of
        addresses, phone numbers or other personal and business information.
      </Rule>
      <Rule title="No spam.">
        No affiliate links or excessive caps. All conversations must be in
        English.
      </Rule>
    </VStack>
  )
}
