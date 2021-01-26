export type Streamer = {
  id: string
  type: 'Individual' | 'Collective'
  photo: string
  name: string
  pronoun: string
  slug: string
  publish: boolean
  info: string
  home?: string
  creators?: Array<string>
  teams?: Array<string>
  cities: Array<string>
  website?: string
  facebook?: string
  youtube?: string
  twitch?: string
  twitter?: string
  instagram?: string
  periscope?: string
  cashapp?: string
  paypal?: string
  venmo?: string
  patreon?: string
  streamlabs?: string
}
