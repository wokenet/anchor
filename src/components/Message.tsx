import * as React from 'react'
import { Text } from '@chakra-ui/react'

type MessageProps = React.ComponentProps<typeof Text> & {
  body: string
  sender: string
}

export default function Message({ body, sender, ...props }: MessageProps) {
  return (
    <Text {...props}>
      {sender}: {body}
    </Text>
  )
}
