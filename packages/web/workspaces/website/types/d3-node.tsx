import {Bool} from '@shared/types/bool'
import {GRID} from '@website/constants'
import {Store} from '@website/stores'
import {getRoot, Instance, types} from 'mobx-state-tree'
import {v4} from 'uuid'
import {NodeData} from './node-data'
import {NodeType} from './node-type'

export const D3Node = types
  .model('D3Node', {
    uuid: types.optional(types.identifier, v4),
    width: types.number,
    height: types.number,
    x: types.number,
    y: types.number,
    nodeType: types.reference(NodeType),
    isSelected: types.optional(Bool, false),
    data: types.optional(NodeData, {}),
  })
  .views(self => ({
    get snapX() {
      return Math.round(self.x / GRID) * GRID
    },
    get snapY() {
      return Math.round(self.y / GRID) * GRID
    },
  }))
  .views(self => ({
    get textX() {
      return self.snapX + self.width / 2
    },
    get textY() {
      return self.snapY + 24 / 1.375
    },
  }))
  .views(self => ({
    get position(): [number, number] {
      return [self.snapX, self.snapY]
    },
    get center(): [number, number] {
      return [
        self.snapX + self.width / 2,
        self.snapY + self.height / 2,
      ]
    },
  }))
  .actions(self => ({
    calculateSize(context: CanvasRenderingContext2D | null) {
      if (context === null) {return}

      // TODO: Get this from node self
      context.font = '16px "Arial"'
      self.width = context.measureText(self.data.get('title', '')).width + GRID * 2
      self.width = self.width + GRID - (self.width % GRID)
    },
    setPosition: (x: number, y: number) => {
      self.x = x
      self.y = y
    },
    remove: () => {
      getRoot<Store>(self).nodeStore.nodesCollection.remove(self as D3Node)
    },
  }))

export interface D3Node extends Instance<typeof D3Node> {}
