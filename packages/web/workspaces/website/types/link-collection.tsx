import {Instance, types} from 'mobx-state-tree'
import {D3Link} from './d3-link'
import {D3Node} from './d3-node'

const exampleNodes = require('../example/nodes.json')
const exampleLinks = [
  {
    uuid: '21d',
    source: exampleNodes[0].uuid,
    target: exampleNodes[2].uuid,
    left: false,
    right: true,
    x: 0,
    y: 0,
  },
  {
    uuid: 'asd213',
    source: exampleNodes[2].uuid,
    target: exampleNodes[1].uuid,
    left: false,
    right: true,
    x: 0,
    y: 0,
  },
]

export const LinkCollection = types
  .model('LinkCollection', {
    value: types.optional(types.array(D3Link), exampleLinks),
  })
  .views(self => ({
    all: () => self.value,
    paths: () => self.value.filter(item => !item.isStraightLine),
    lines: () => self.value.filter(item => item.isStraightLine),
    last: () => self.value[self.value.length - 1],
  }))
  .actions(self => ({
    add: (element: Instance<typeof D3Link>) => {
      self.value.push(element)
    },
    remove: (link: D3Link) => {
      self.value.splice(self.value.indexOf(link), 1)
    },
    detachNode: (node: D3Node) => {
      const toSplice = self.value.filter((item) =>
        item.source.uuid === node.uuid ||
        item.target.uuid === node.uuid
      )

      for (const link of toSplice) {
        self.value.splice(self.value.indexOf(link), 1)
      }
    },
  }))
