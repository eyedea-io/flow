import {getFontFamily, getTextColor, getTextStyle} from '@shared/theme/utils'
import {css, styled} from '@shared/utils/styled'
import {Props} from './'

export default styled.span.attrs({})<Props>`
  ${({
    size = 400,
    fontFamily = 'ui',
    color = 'default',
    intent,
  }) => css`
    color: ${getTextColor(intent || color)};
    font-family: ${getFontFamily(fontFamily)};
    ${getTextStyle(size)}
  `}
`
