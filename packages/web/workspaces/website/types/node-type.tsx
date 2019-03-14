import {Instance, types} from 'mobx-state-tree'

export interface SchemaItem {
  label?: string
  component?: 'json-schema' | 'select' | 'input'
  options?: {
    label: string
    value: string
  }[]
}

export const NodeType = types
  .model('NodeType', {
    name: types.identifier,
    color: types.string,
    schema: types.frozen<{
      [name: string]: SchemaItem
    }>(),
  })

export interface NodeType extends Instance<typeof NodeType> {}
