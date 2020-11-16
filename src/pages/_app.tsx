import * as React from 'react'
import type { AppProps } from 'next/app'
import { extendTheme, ChakraProvider } from '@chakra-ui/react'

const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
  styles: {
    global: {
      'html, body': {
        margin: 0,
      },
    },
  },
})

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
