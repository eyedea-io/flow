import {media} from '@shared/utils/css-helpers'
import {colors, fills, palette} from './foundational-styles'
import spacing from './spacing'

export const theme = {
  spacing,
  colors,
  palette,
  fills,
  radius: '5px',
  media: {
    desktop: media(769),
    tablet: media(567, 768),
    tabletAndUp: media(567),
    tabletAndDown: media(0, 768),
    phone: media(0, 576),
  },
}
