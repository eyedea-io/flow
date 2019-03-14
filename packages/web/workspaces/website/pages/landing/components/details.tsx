import {Button} from '@shared/components/button'
import {useStore} from '@website/hooks/use-store'
import {D3Node} from '@website/types/d3-node'
import {SchemaItem} from '@website/types/node-type'
import {observer, Observer} from 'mobx-react-lite'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import S from './details.styled'

const DetailsComponent = () => {
  const {nodeStore: {nodesCollection}} = useStore()
  const node = nodesCollection.selected[0]

  if (nodesCollection.selected.length !== 1 || node.nodeType === undefined) {
    return <div />
  }

  return (
    <S.Details>
      <S.Header>{node.nodeType.name} Properties</S.Header>
      <S.FieldList>
        {Object.entries(node.nodeType.schema).map(([name, item]: any) => (
          <S.Field key={name}>
            <S.FieldLabel htmlFor={name}>{item.label}</S.FieldLabel>
            <S.FieldValue>
              <Observer>
                {() => getInputForNode(name, node, item)}
              </Observer>
            </S.FieldValue>
          </S.Field>
        ))}
      </S.FieldList>

      <S.Footer>
        <Button
          height={32}
          appearance="minimal"
          intent="danger"
          onClick={node.remove}
        >Delete node</Button>
      </S.Footer>
    </S.Details>
  )
}

export const Details = hot(module)(observer(DetailsComponent))

function getInputForNode(name: string, node: D3Node, schemaItem: SchemaItem) {
  switch (schemaItem.component) {
    case 'json-schema':
      return (
        <S.FieldJSONSchema>
          {/* tslint:disable-next-line:max-line-length */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g stroke="none"><path d="M18.707 2.293a.999.999 0 0 0-1.414 0l-8 8a1.003 1.003 0 0 0-.263.464l-1 4a1 1 0 0 0 1.212 1.213l4-1c.176-.044.337-.135.465-.263l8-8a.999.999 0 0 0 0-1.414l-3-3zm-6.219 10.804l-2.114.528.529-2.114L18 4.414 19.586 6l-7.098 7.097z" /><path d="M5 20h14a1 1 0 0 0 1-1v-6h-2v5H6V6h5V4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1z" /></g></svg>
          <span>Edit JSON Schema...</span>
        </S.FieldJSONSchema>
      )
    case 'select':
      return (
        <S.FieldSelect
          id={name}
          name={name}
          value={node.data.get(name, '')}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            node.data.setValue(event.target.name, event.target.value)
          }}
        >
          <option>&mdash;</option>
          {schemaItem.options ? schemaItem.options.map(item => (
            <option key={item.value} value={item.value}>{item.label}</option>
          )) : null}
        </S.FieldSelect>
      )
    case 'input':
    default:
      return (
        <S.FieldInput
          id={name}
          name={name}
          autoFocus
          spellCheck={false}
          value={node.data.get(name, '')}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            node.data.setValue(event.target.name, event.target.value)
          }}
        />
      )
  }
}
