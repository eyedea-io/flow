import * as React from 'react'
import {theme} from '../../theme'
import {getButtonStyle, getTextSizeForControlHeight} from '../../theme/utils'
import {styled} from '../../utils/styled'
import {Text} from '../text'

type Props = React.ButtonHTMLAttributes<{}> & {
  appearance?: 'default' | 'primary' | 'minimal'
  intent?: 'default' | 'success' | 'danger' | 'warning'
  isLoading?: boolean
  height?: number
}

const Button = ({
  height = 40,
  disabled,
  isLoading,
  ...props
}: Props) => {
  const textSize = getTextSizeForControlHeight(height)
  const StyledText: any = Text

  return (
    <StyledText
      as={'button' as 'button'}
      size={textSize}
      disabled={disabled || isLoading}
      {...props} />
  )
}

const StyledButton = styled(Button).attrs({})<Props>`
  height: ${_ => _.height || 40}px;
  position: relative;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  border: none;
  border-radius: ${theme.radius};
  padding-left: ${_ => (_.height || 40) / 2}px;
  padding-right: ${_ => (_.height || 40) / 2}px;

  ${_ => getButtonStyle(_.appearance, _.intent)};
`

export default StyledButton
