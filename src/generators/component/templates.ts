import { compile } from 'json-schema-to-typescript'

//  Generate index.ts file
export const index = ({node: {name}, normalizedName}) => `export {default as ${name}} from './${normalizedName}'
export {Props} from './${normalizedName}.types'
`

// Generate component.types.ts
const baseTypeImport = ({extendName}) => `${extendName ? `import {${extendName.split('#')[1]}} from '${extendName.split('#')[0]}'\n\n` : ''}`
export const types = ({
  props, 
  node: {extends: extendName}
}) => 
  compile(props, 'MySchema', {
    bannerComment: ''
  })
    .then(ts => `${baseTypeImport({extendName})}export interface Props ${extendName ? `extends ${extendName.split('#')[1]} ` : ''}${ts.replace('export interface MySchema ', '')}`)

// Generate component.tsx
export const component = ({node: {name}, imports}) => `// imports
${imports.map(item => `import {${item.name}} from '${item.path}'`).join('\n')}
// imports-end

import {${name}} from './styled'

export default ({}: Props) => (
  <${name} />
)
`
// Generate component imports
export const imports = ({imports}) => `${imports.map(item => `import {${item.name}} from '${item.path}'`).join('\n')}`

// Generate styled components
export const styled = ({node: {name}}) => `import {styled} from '@shared/utils/styled'

export const ${name} = styled.div\`

\`
`