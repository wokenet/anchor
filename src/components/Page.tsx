import * as React from 'react'
import Head from 'next/head'
import { Flex } from '@chakra-ui/react'

import { GATag } from '../googleAnalytics'
import Header from '../components/Header'
import FooterLinks from './FooterLinks'

type PageProps = {
  title?: string
  noHeader?: boolean
  noFooter?: boolean
  children: React.ReactNode
}
export default function Page({
  title,
  noHeader,
  noFooter,
  children,
}: PageProps) {
  return (
    <>
      <Head>
        <title>
          {title && title.toUpperCase()}
          {title ? ' – ' : ''}WOKE.NET LIVE STREAM - GET ENGAGED - STAY WOKE!
        </title>
        <link rel="icon" href="/static/favicon.png"></link>
        <meta name="description" content="Watch live social movements, collective action &amp; civic engagement. We access, amplify and archive historic livestreams of the disenfranchised." />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://woke.net/" />
        <meta property="og:title" content="WOKE.NET LIVESTREAM - GET ENGAGED - STAY WOKE!" />
        <meta property="og:description" content="Watch live social movements, collective action &amp; civic engagement. We access, amplify and archive historic livestreams of the disenfranchised." />
        <meta property="og:image" content="https://woke.net/static/woke-social.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://woke.net/" />
        <meta property="twitter:title" content="WOKE.NET LIVESTREAM - GET ENGAGED - STAY WOKE!" />
        <meta property="twitter:description" content="Watch live social movements, collective action &amp; civic engagement. We access, amplify and archive historic livestreams of the disenfranchised." />
        <meta property="twitter:image" content="https://woke.net/static/woke-social.jpg" />
      </Head>
      <GATag />
      <Flex
        direction="column"
        width="100vw"
        height="100vh"
        bg="gray.950"
        overflow="hidden"
      >
        {!noHeader && <Header />}
        <Flex flex={1} flexDirection="column" overflow="auto">
          {children}
        </Flex>
        {!noFooter && <FooterLinks as="footer" />}
      </Flex>
    </>
  )
}
