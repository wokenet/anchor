import * as React from 'react'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  HTMLProps,
  ForwardedRef,
} from 'react'
import { chakra } from '@chakra-ui/react'
import Hls from 'hls.js'

const VideoEl = chakra('video')

type VideoProps = React.ComponentProps<typeof VideoEl>
const Video = forwardRef(
  ({ src, ...props }: VideoProps, ref: ForwardedRef<HTMLVideoElement>) => {
    const videoRef = useRef<HTMLVideoElement>()

    useEffect(() => {
      const video = videoRef.current
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
      } else if (Hls.isSupported()) {
        var hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play()
        })
      }
      video.addEventListener(
        'playing',
        () => {
          video.controls = true
        },
        { once: true },
      )
    }, [src])

    useImperativeHandle(ref, () => videoRef.current)

    return <VideoEl key={src} ref={videoRef} {...props} />
  },
)

export default Video
