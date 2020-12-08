import * as React from 'react'
import { Box } from '@chakra-ui/react'

import Page from 'src/components/Page'

export default function StreamersPage() {
  return (
    <Page title="streams" noFooter>
      <Box
        as="iframe"
        src="//docs.google.com/spreadsheets/d/e/2PACX-1vShBTaX7y4SyR_BLwnu6dLCsg_tmPESi0nI-CEJxySfv8WOutEiKLSadCWwToXYDo0GVwnKYyQJQR4X/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"
        h="full"
        px={2}
        background="white"
        css={{ filter: 'grayscale(.75) invert(1)' }}
      />
    </Page>
  )
}
