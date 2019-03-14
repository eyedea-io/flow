export interface Props extends React.ButtonHTMLAttributes<{}> {
  short?: boolean,
  loading?: boolean,
  disabled?: boolean
  variant: 'primary' | 'positive' | 'negative'
}
