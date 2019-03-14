import {theme} from '@shared/theme'
import {styled} from '@shared/utils/styled'

export default {
  Details: styled.div`
    position: fixed;
    top: ${theme.spacing.md};
    right: ${theme.spacing.md};
    border-radius: ${theme.radius};
    overflow: hidden;
    box-shadow: 0 2px 18px hsla(0, 0%, 0%, 0.07);
    background-color: ${theme.colors.background.tint1};
    border: 1px solid ${theme.colors.border.default};
    min-width: 280px;
  `,
  Header: styled.h3`
    font-size: 11px;
    letter-spacing: .055em;
    text-transform: uppercase;
    padding: ${theme.spacing.xxs};
    color: ${theme.colors.text.dark};
  `,
  Footer: styled.div`
    padding: ${theme.spacing.xxs};
  `,
  FieldList: styled.div`
    display: grid;
    border-top: 1px solid ${theme.colors.border.default};
    border-bottom: 1px solid ${theme.colors.border.default};
  `,
  Field: styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    font-size: 13px;
    align-items: center;

    & + & {
      border-top: 1px solid ${theme.colors.border.default};
    }
  `,
  FieldLabel: styled.label`
    border-right: 1px solid ${theme.colors.border.default};
    line-height: 24px;
    color: ${theme.colors.text.muted};
    padding: ${theme.spacing.xxxs} ${theme.spacing.xxs};
    min-width: 100px;
  `,
  FieldValue: styled.div``,
  FieldInput: styled.input`
    padding: ${theme.spacing.xxxs} ${theme.spacing.xxs};
    width: 100%;
    border: none;
    height: 32px;
    background: transparent;
    font-weight: bold;

    &:focus {
      outline: none;
      background-color: ${theme.colors.background.greenTint};
    }
  `,
  FieldJSONSchema: styled.div`
    padding: ${theme.spacing.xxxs} ${theme.spacing.xxs};
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    color: ${theme.colors.link.default};

    &:hover {
      text-decoration: underline;
    }

    svg {
      margin-right: ${theme.spacing.xxxs};
      fill: ${theme.colors.icon.default};
    }
  `,
  FieldSelect: styled.select`
    padding: ${theme.spacing.xxxs} ${theme.spacing.xxxs};
    width: 100%;
    border: none;
    height: 32px;
    background: transparent;
    font-weight: bold;

    &:focus {
      outline: none;
      background-color: ${theme.colors.background.greenTint};
    }
  `,
}
