import {Text} from '@shared/components/text'
import {theme} from '@shared/theme'
import {styled} from '@shared/utils/styled'

export default {
  Toolbar: styled.div`
    position: absolute;
    border-radius: ${theme.radius};
    overflow: hidden;
    box-shadow: 0 2px 18px hsla(0, 0%, 0%, 0.07);
    background-color: ${theme.fills.solid.neutral.backgroundColor};
    padding: ${theme.spacing.xxs};
  `,
  ToolbarItem: styled.div`
    min-width: 180px;
    padding: ${theme.spacing.xxs} 16px;
    cursor: pointer;
    border-radius: ${theme.radius};

    ${Text} {
      color: ${theme.fills.solid.green.color};
      font-weight: 600;
    }

    &:hover {
      background-color: ${theme.fills.solid.green.backgroundColor};
    }
  `,
}
