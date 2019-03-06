import {getFontFamily, getHeadingStyle} from '@shared/theme/utils'
import {css, styled} from '@shared/utils/styled'
import {Props} from '.'

export default styled.h2.attrs({})<Props>`
  margin: 0;

  ${({
    size = 500,
  }) => css`
    ${getHeadingStyle(size)}
  `}

  ${({
    fontFamily,
  }) => fontFamily ? css`
    font-family: ${getFontFamily(fontFamily)};
  ` : ''}
`
