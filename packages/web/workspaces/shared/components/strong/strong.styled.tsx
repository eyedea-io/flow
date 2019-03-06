import {getFontFamily, getTextColor, getTextStyle} from '@shared/theme/utils'
import {css, styled} from '@shared/utils/styled'
import {Props} from './'

export default styled.strong.attrs({})<Props>`
  ${({
    size = 400,
    fontFamily = 'ui',
    color = 'default',
  }) => css`
    color: ${getTextColor(color)};
    font-family: ${getFontFamily(fontFamily)};
    ${getTextStyle(size)}
  `}
  font-weight: 600;
`
