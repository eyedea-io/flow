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
    bannerComment: '',
    style: {
      singleQuote: true,
    }
  })
    .then(ts => `${baseTypeImport({extendName})}export interface Props ${extendName ? `extends ${extendName.split('#')[1]} ` : ''}${ts
      .replace('export interface MySchema ', '')
      .replace(/;$/gm, '')}`)

// Generate component.fixture.tsx
export const fixture = ({node: {name}}) => `import {${name}} from './'

export default [
  {
    component: ${name},
    name: 'default',
    wrap: true,
    props: {},
  },
]
`

// Generate component.tsx
export const component = ({node: {name}, imports, normalizedName}) => `// imports
${imports.map(item => `import {${item.name}} from '${item.path}'`).join('\n')}
// imports-end

import * as React from 'react'

import {${name}} from './${normalizedName}.styled'

export default ({}: Props) => (
  <${name}>TODO: ${name}</${name}>
)
`
// Generate component imports
export const imports = ({imports}) => `${imports.map(item => `import {${item.name}} from '${item.path}'`).join('\n')}`

// Generate styled components
export const styled = ({node: {name}}) => `import {styled} from '@shared/utils/styled'

export const ${name} = styled.div\`

\`
`
