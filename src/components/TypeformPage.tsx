import * as React from 'react'
import { useRef } from 'react'
import { Box } from '@chakra-ui/react'

import Page from './Page'
import FooterLinks from './FooterLinks'

type TypeformPageProps = {
  title: string
  formId: string
}
export default function TypeformPage({ title, formId }: TypeformPageProps) {
  const frame = useRef<HTMLIFrameElement>()

  function handleLoad() {
    if (frame.current) {
      frame.current.contentWindow.focus()
    }
  }

  return (
    <Page title={title} noFooter>
      <Box
        ref={frame}
        as="iframe"
        src={`//form.typeform.com/to/${formId}`}
        h="full"
        onLoad={handleLoad}
      />
      <FooterLinks
        as="footer"
        position="absolute"
        bottom="0"
        display={{ base: 'none', lg: 'flex' }}
      />
    </Page>
  )
}
