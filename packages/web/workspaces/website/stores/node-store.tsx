import {types} from 'mobx-state-tree'

const Node = types
  .model('Node', {

  })

const NodeCollection = types
  .model('NodeCollection', {
    items: types.optional(types.array(Node), []),
  })

export const NodeStore = types
  .model('NodeStore', {
    collection: NodeCollection,
  })
