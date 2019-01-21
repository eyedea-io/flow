export const index = ({name, normalizedName}) => `export {default as ${name}} from './${normalizedName}'
`
export const types = `export interface Props {}
`
export const component = ({name, imports, normalizedName}) => `// imports
${imports.map(item => `import {${item.name}} from '${item.path}'`).join('\n')}
// importsend

import {${name}} from './styled'

export default ({}: Props) => (
  <${name} />
)
`
export const imports = ({imports}) => `${imports.map(item => `import {${item.name}} from '${item.path}'`).join('\n')}`
export const styled = ({name}) => `import {styled} from '@shared/utils/styled'

export const ${name} = styled.div\`

\`
`