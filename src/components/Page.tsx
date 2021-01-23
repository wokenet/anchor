import * as React from 'react'
import { truncate } from 'lodash'
import Head from 'next/head'
import { Flex } from '@chakra-ui/react'

import { matrixServer } from '../../constants.json'
import { GATag } from '../googleAnalytics'
import Header from '../components/Header'
import FooterLinks from './FooterLinks'

type PageProps = {
  title?: string
  description?: string
  socialImage?: string
  noHeader?: boolean
  noFooter?: boolean
  children: React.ReactNode
}
export default function Page({
  title,
  description = 'Watch live social movements, collective action &amp; civic engagement. We access, amplify and archive historic livestreams of the disenfranchised.',
  socialImage = 'https://woke.net/static/woke-social.jpg',
  noHeader,
  noFooter,
  children,
}: PageProps) {
  const fullTitle = `${title ? title.toUpperCase() + ' – ' : ''}WOKE.NET`
  const socialDescription = truncate(description, { length: 280 })
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <link rel="icon" href="/static/favicon.png"></link>
        <meta name="description" content={description} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href={matrixServer} />
        <link rel="dns-prefetch" href={matrixServer} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://woke.net/" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={socialDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://woke.net/" />
        <meta property="twitter:title" content={fullTitle} />
        <meta property="twitter:description" content={socialDescription} />
        <meta property="twitter:image" content={socialImage} />
      </Head>
      {process.env.NODE_ENV === 'production' && <GATag />}
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
        {!noFooter && (
          <FooterLinks as="footer" display={{ base: 'none', lg: 'flex' }} />
        )}
      </Flex>
    </>
  )
}
