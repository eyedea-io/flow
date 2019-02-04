import {getSchemaWithRefs, nodeTypeMap, Store} from '@flow/schema-reader'
import {Command} from '@oclif/command'
import * as traverse from 'traverse'

import {printOrdered} from '../utils'

export default class List extends Command {
  static description = 'list all objects'

  static args = [
    {
      name: 'nodeType',
      description: 'type of the nodes to list',
    },
  ]

  async run() {
    const {args} = this.parse(List)

    const projectWithoutRefs = await getSchemaWithRefs()
    const store = new Store()

    const countObjects = (node: any, pathToSearch: string[], objType: keyof Store) => {
      if (nodeTypeMap[node.nodeType] === objType) {
        let obj = store[objType][node.name]
        if (!obj) {
          const klass = store.getClass(objType)
          obj = new klass(node)
          store.addNode(obj, objType)
        }
        obj.bumpScore()
      }
    }

    traverse(projectWithoutRefs).forEach(function (item: any) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        if (this.node.name && typeof this.node.name === 'string') {
          if (args.nodeType) {
            countObjects(this.node, this.path.slice(), args.nodeType)
          } else {
            countObjects(this.node, this.path.slice(), 'views')
            countObjects(this.node, this.path.slice(), 'viewStories')
            countObjects(this.node, this.path.slice(), 'stories')
            countObjects(this.node, this.path.slice(), 'components')
            countObjects(this.node, this.path.slice(), 'endpoints')
            countObjects(this.node, this.path.slice(), 'flows')
          }
        }
      }
    })

    if (args.nodeType) {
      printOrdered(args.nodeType, store)
    } else {
      printOrdered('endpoints', store)
      printOrdered('components', store)
      printOrdered('views', store)
      printOrdered('stories', store)
      printOrdered('flows', store)
    }
  }
}
