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
          {title ? ' – ' : ''}WOKE.NET
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/static/favicon.png"></link>
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
