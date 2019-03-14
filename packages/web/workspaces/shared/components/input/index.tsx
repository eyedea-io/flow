import styled from '@shared/utils/styled'
import * as React from 'react'

export interface Props extends React.InputHTMLAttributes<{}> {
  short?: boolean
  label?: string
  height?: number
}

const StyledInput = styled.input.attrs({})<Props>`
  background-color: hsl(0, 0%, 97%);
  color: hsl(0, 0%, 40%);
  box-shadow: none;
  padding: 14px ${_ => (_.height || 40) / 3}px;
  height: ${_ => _.height || '40'}px;
  border: 1px solid ${({theme}) => theme.colors.ui.hex};
  transition: border-color 0.25s, box-shadow 0.25s;
  border-radius: ${props => props.theme.radius};
  width: 100%;

  &:focus {
    outline: 0;
    box-shadow: 0 1px 4px hsla(0, 0%, 0%, 0.1);
    border-color: ${props => props.theme.colors.primary.hex};
  }
  &::placeholder {
    color: hsl(0, 0%, 60%);
  }
  &:disabled,
  &:disabled::placeholder {
    color: hsl(0, 0%, 70%);
  }
`

const InputComponent: React.FC<Props> = ({
  type = 'text',
  ...props
}) => (
  <StyledInput {...props} type={type} />
)

export const Input = styled(InputComponent)``
