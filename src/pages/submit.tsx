import * as React from 'react'
import { Box } from '@chakra-ui/react'

import Page from 'src/components/Page'

export default function SubmitPage() {
  return (
    <Page title="submit streams & videos" noFooter>
      <Box
        as="iframe"
        src="//docs.google.com/forms/d/e/1FAIpQLSfQqbjsj4oxNDh9cPE-FWMCwVIJ9i862JgeDnqoyF4HOwm98Q/viewform"
        h="full"
        px={2}
        background="white"
        css={{ filter: 'grayscale(.75) invert(1)' }}
      />
    </Page>
  )
}
