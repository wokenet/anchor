import * as React from 'react'
import { Box } from '@chakra-ui/react'

import Page from 'src/components/Page'

export default function StreamsPage() {
  return (
    <Page title="streams" noFooter>
      <Box
        as="iframe"
        src="//embedsocial.com/facebook_album/pro_hashtag/04efc264b55775f03dd002080d48735e180d4fbe"
        h="full"
        px={2}
        background="white"></Box>
    </Page>
  )
}
