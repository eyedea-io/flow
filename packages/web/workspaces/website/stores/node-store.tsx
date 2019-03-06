import {theme} from '@shared/theme'
import {Bool} from '@shared/types/bool'
import {GRID} from '@website/pages/landing/constants'
import {Instance, types} from 'mobx-state-tree'

const NodeType = types
  .model('NodeType', {
    name: types.identifier,
    color: types.string,
  })

const D3Node = types
  .model('D3Node', {
    id: types.identifierNumber,
    label: types.maybe(types.string),
    width: types.number,
    height: types.number,
    x: types.number,
    y: types.number,
    nodeType: types.reference(NodeType),
    isSelected: types.optional(Bool, false),
  })
  .views(self => ({
    get snapX() {
      return Math.round(self.x / GRID) * GRID
    },
    get snapY() {
      return Math.round(self.y / GRID) * GRID
    },
  }))
  .actions(self => ({
    setPosition: (x: number, y: number) => {
      self.x = x
      self.y = y
    },
  }))

const D3Link = types
  .model('D3Link', {
    source: types.safeReference(D3Node),
    target: types.safeReference(D3Node),
    left: types.boolean,
    right: types.boolean,
    x: types.number,
    y: types.number,
  })
  .actions(self => ({
    setRight(value: boolean) {
      self.right = value
    },
    setLeft(value: boolean) {
      self.left = value
    },
  }))

const NodeCollection = types
  .model('NodeCollection', {
    value: types.optional(types.array(D3Node), [
      {
        id: 1,
        nodeType: 'Project',
        x: 24,
        y: 48,
        width: 120,
        height: 48,
      },
      {
        id: 2,
        nodeType: 'Component',
        x: 120,
        y: 240,
        width: 120,
        height: 48,
      },
    ]),
  })
  .views(self => ({
    get selected() {
      return self.value.filter(item => item.isSelected.value)
    },
  }))
  .views(self => ({
    last: () => self.value[self.value.length - 1],
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
    add: (node: Instance<typeof D3Node.SnapshotType>) => {
      self.value.push(node)
    },
    remove: (node: D3Node) => {
      self.value.splice(self.value.indexOf(node), 1)
    },
    getById: (id: number) => {
      return self.value.find(item => item.id === id)
    },
    unselectAll: () => {
      self.value.map(item => item.isSelected.setFalse())
    },
  }))

const LinkCollection = types
  .model('LinkCollection', {
    value: types.optional(types.array(D3Link), [
      // {source: 0, target: 1, left: false, right: true, x: 0, y: 0},
      // {source: 1, target: 2, left: false, right: true},
    ]),
  })
  .views(self => ({
    last: () => self.value[self.value.length - 1],
  }))
  .actions(self => ({
    add: (element: Instance<typeof D3Link.SnapshotType>) => {
      self.value.push(element)
    },
    remove: (link: D3Link) => {
      self.value.splice(self.value.indexOf(link), 1)
    },
    detachNode: (node: D3Node) => {
      const toSplice = self.value.filter((item) => item.source.id === node.id || item.target.id === node.id)

      for (const link of toSplice) {
        self.value.splice(self.value.indexOf(link), 1)
      }
    },
  }))

export const NodeStore = types
  .model('NodeStore', {
    lastNodeId: types.optional(types.number, 2),
    nodeTypes: types.optional(types.array(NodeType), [
      {
        name: 'Project',
        color: theme.fills.subtle.blue.color,
      },
      {
        name: 'Endpoint',
        color: theme.fills.subtle.green.color,
      },
      {
        name: 'Context',
        color: theme.fills.subtle.orange.color,
      },
      {
        name: 'Component',
        color: theme.fills.subtle.purple.color,
      },
    ]),
    nodesCollection: types.optional(NodeCollection, {}),
    linksCollection: types.optional(LinkCollection, {}),
  })

export interface NodeType extends Instance<typeof NodeType> {}
export interface D3Node extends Instance<typeof D3Node> {}
export interface NodeCollection extends Instance<typeof NodeCollection> {}
export interface D3Link extends Instance<typeof D3Link> {}
