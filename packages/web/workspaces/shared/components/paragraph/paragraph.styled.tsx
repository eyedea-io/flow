import {getFontFamily, getParagraphStyle, getTextColor} from '@shared/theme/utils'
import {css, styled} from '@shared/utils/styled'
import {Props} from '.'

export default styled.p.attrs({})<Props>`
  ${({
    size = 400,
    fontFamily = 'ui',
    color = 'default',
  }) => css`
    color: ${getTextColor(color)};
    font-family: ${getFontFamily(fontFamily)};
    ${getParagraphStyle(size)}
  `}
`
