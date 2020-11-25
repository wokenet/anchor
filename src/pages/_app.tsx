import * as React from 'react'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import * as Sentry from '@sentry/react'

import '../styles.css'
import { sentryDSN } from '../../constants.json'
import { useGAPageviewTracking } from 'src/googleAnalytics'

const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
  colors: {
    yaleBlue: {
      50: '#e1eeff',
      100: '#b9d2f7',
      200: '#90b8ee',
      300: '#66a0e7',
      400: '#3e8bde',
      500: '#2877c5',
      600: '#1c619a',
      700: '#11486f',
      800: '#042745',
      900: '#000b1b',
    },
    goldenrod: {
      50: '#f9f9e6',
      100: '#eeeec3',
      200: '#e3de9e',
      300: '#d8cb77',
      400: '#cdb452',
      500: '#b4933a',
      600: '#8c6c2c',
      700: '#64481f',
      800: '#3c2811',
      900: '#140900',
    },
    orangeYellow: {
      50: '#fff3db',
      100: '#fee1ae',
      200: '#fcd37f',
      300: '#fbc84e',
      400: '#fac01e',
      500: '#e1ae05',
      600: '#af7b00',
      700: '#7d5000',
      800: '#4c2b00',
      900: '#1c0b00',
    },
    flame: {
      50: '#fff1df',
      100: '#ffd6b2',
      200: '#fcb783',
      300: '#f99653',
      400: '#f67023',
      500: '#dc5009',
      600: '#ac4805',
      700: '#7b3b03',
      800: '#4b2800',
      900: '#1f0e00',
    },
    deepRed: {
      50: '#ffebe5',
      100: '#fcc8b8',
      200: '#f4a08a',
      300: '#ef755c',
      400: '#ea4a2e',
      500: '#d12c15',
      600: '#a31c10',
      700: '#750f0b',
      800: '#470b04',
      900: '#1d0400',
    },
    gray: {
      50: '#f3f3f1',
      100: '#dcdcdb',
      200: '#c3c3c3',
      300: '#ababa8',
      400: '#94948e',
      500: '#7a7a73',
      600: '#605f5b',
      700: '#1a1a19',
      800: '#151514',
      900: '#0e0e0c',
      950: '#060605',
    },
  },
  fonts: {
    body: 'Noto Sans, sans-serif',
    heading: 'Noto Sans, sans-serif',
  },
  shadows: {
    outline: '0 0 0 3px rgba(143, 119, 40, 0.6)',
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
  useGAPageviewTracking()

  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

Sentry.init({
  dsn: sentryDSN,
})

export default App
