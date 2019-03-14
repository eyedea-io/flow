import {Store} from '@website/stores'
import {destroy, getRoot, Instance, types} from 'mobx-state-tree'
import {D3Node} from './d3-node'
const exampleNodes = require('../example/nodes.json')

export const NodeCollection = types
  .model('NodeCollection', {
    value: types.optional(types.array(D3Node), exampleNodes),
  })
  .views(self => ({
    get selected() {
      return self.value.filter(item => item.isSelected.value)
    },
  }))
  .views(self => ({
    last: () => self.value[self.value.length - 1],
    all: (): D3Node[] => self.value as never,
    getByCoordinates: ({x, y}: {x: number, y: number}) => {
      return self.value.filter(item => {
        return item.x <= x &&
          item.x + item.width >= x &&
          item.y <= y &&
          item.y + item.height >= y
      }).pop()
    },
    get hasSelection() {
      return self.value.some(item => item.isSelected.value)
    },
    get selection() {
      const selected = self.selected
      const x = Math.min(...selected.map(item => item.snapX))
      const y = Math.min(...selected.map(item => item.snapY))
      const width = Math.max(...selected.map(item => item.snapX + item.width)) - x
      const height = Math.max(...selected.map(item => item.snapY + item.height)) - y

      return {x, y, width, height}
    },
  }))
  .actions(self => ({
    add: (node: Instance<typeof D3Node>) => {
      self.value.push(node)
    },
    remove: (node: Instance<typeof D3Node>) => {
      getRoot<Store>(node).nodeStore.linksCollection.detachNode(node)
      destroy(node)
    },
    getById: (uuid: string) => {
      return self.value.find(item => item.uuid === uuid)
    },
    unselectAll: () => {
      self.value.map(item => item.isSelected.setFalse())
    },
  }))
  .actions(self => ({
    removeSelected: () => {
      self.selected.forEach(node => {
        self.remove(node)
      })
    },
  }))

export interface NodeCollection extends Instance<typeof NodeCollection> {}
