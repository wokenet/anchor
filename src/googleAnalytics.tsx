import * as React from 'react'
import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { googleAnalyticsId } from '../constants.json'

export function GATag() {
  return (
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${googleAnalyticsId}');
          `,
        }}
      />
    </Head>
  )
}

// via https://github.com/vercel/next.js/blob/86a0c7b0f7133362b5a5358428fe8ca334fe394e/examples/with-google-analytics/lib/gtag.js
function pageview(url) {
  window.gtag('config', googleAnalyticsId, {
    page_path: url,
  })
}

export function useGAPageviewTracking() {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
