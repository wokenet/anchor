import * as React from 'react'
import { Box } from '@chakra-ui/react'

import Page from 'src/components/Page'

export default function VideosPage() {
  return (
    <Page title="streams" noFooter>
      <Box
        as="iframe"
        src="//sociablekit.com/app/embed/58475"
        h="full"
        px={2}
        background="black"
      />
    </Page>
  )
}
