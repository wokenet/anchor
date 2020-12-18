import { useToken } from '@chakra-ui/react'
import Color from 'tinycolor2'

export function getSenderColor(sender: string) {
  if (sender === '@wokebot:woke.net') {
    return 'orangeYellow.500'
  }

  return redOrangeYellowColor(sender).toHexString()
}

function hashText(text: string, range: number, start: number = 0) {
  // DJBX33A-ish
  // based on https://github.com/euphoria-io/heim/blob/978c921063e6b06012fc8d16d9fbf1b3a0be1191/client/lib/hueHash.js#L16-L45
  for (let i = 0; i < text.length; i++) {
    // Multiply by an arbitrary prime number to spread out similar letters.
    const charVal = (text.charCodeAt(i) * 401) % range
    // Multiply val by 33 while constraining within signed 32 bit int range.
    // this keeps the value within Number.MAX_SAFE_INTEGER without throwing out
    // information.
    const origVal = start
    start = start << 5
    start += origVal
    // Add the character to the hash.
    start += charVal
  }
  return ((start % range) + range) % range
}

function redOrangeYellowColor(id: string) {
  if (!id) {
    return Color('white')
  }

  const h = hashText(id, 60)
  const sPart = hashText(id, 60)
  return Color({ h, s: 70 + sPart, l: 60 })
}
