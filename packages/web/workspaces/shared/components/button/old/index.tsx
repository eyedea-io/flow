// import {Block, Props as BlockProps} from '@shared/components/block'
// import {Spinner} from '@shared/components/spinner'
// import styled from '@shared/utils/styled'
// import * as React from 'react'

// export interface Props extends React.ButtonHTMLAttributes<{}>, BlockProps {
//   short?: boolean,
//   loading?: boolean,
//   height?: number
//   disabled?: boolean
//   appearance?: 'primary' | 'minimal' | 'default'
//   intent?: 'positive' | 'negative'
// }

// const StyledButton = styled(Block).attrs({})<Props>`
//   transition-property: transform, box-shadow, background;
//   transition-duration: 0.25s;
//   letter-spacing: .025em;
//   padding: 0 ${_ => (_.height || 32) / 2}px;
//   font-family: inherit;
//   display: inline-block;
//   border: 0;
//   cursor: pointer;
//   font-weight: 500;
//   color: hsl(0, 0%, 100%);
//   border-radius: ${({theme}) => theme.radius};
//   height: ${_ => _.height || 32}px;
//   width: ${({short}) => short ? 'auto' : '100%'};
//   background: ${({theme, intent}) => theme.colors[intent].hex};

//   &:focus,
//   &:hover {
//     box-shadow: inset 0 0 100px 0 hsla(0, 0%, 100%, 0.2), 0 3px 6px 0 hsla(0, 0%, 0%, 0.2);
//     transform: translateY(-1px)
//   }
//   &:active {
//     box-shadow: inset 0 0 100px 0 hsla(0, 0%, 0%, 0.07);
//     transform: translateY(1px);
//   }
//   &:focus {
//     outline: 0;
//   }
//   &[disabled],
//   &[disabled]:focus,
//   &[disabled]:hover,
//   &[disabled]:active {
//     background-color: hsl(0, 0%, 96%);
//     color: hsl(0, 0%, 73%);
//     transform: none;
//     box-shadow: none;
//   }
// `

// export const Button = ({loading, ...props}: Props) => (
//   <StyledButton {...props} as="button">
//     {loading ? <Spinner white small /> : props.children}
//   </StyledButton>
// )
