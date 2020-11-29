import * as React from 'react'
import { Box } from '@chakra-ui/react'

import Page from 'src/components/Page'

export default function StreamsPage() {
  return (
    <Page title="streams" noFooter>
      <Box
        as="iframe"
        src="//docs.google.com/spreadsheets/d/e/2PACX-1vRwy_RmqgnDQiYnzJDpvQA3t_q1XgJB42L1PrzDj9yLhhoSf899fH51fSnIaWwNNX1qELmyH9I2qQhc/pubhtml?widget=true&headers=false"
        h="full"
        px={2}
        background="white"
        css={{ filter: 'grayscale(.75) invert(1)' }}
      />
    </Page>
  )
}
