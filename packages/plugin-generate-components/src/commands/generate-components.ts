import {getSchemaWithRefs, nodeTypeMap, Store} from '@flow/schema-reader'
import {Command} from '@oclif/command'
import traverse from 'traverse'

import {FileGenerator} from '../generators/file'

export default class Generate extends Command {
  static description = 'bootstrap files from schema'
  static examples = ['$ <%- config.bin %> generate']
  store = new Store()

  async run() {
    // tslint:disable-next-line:no-console
    console.time('Done in')
    // const {args, flags} = this.parse(Generate)
    const project = await getSchemaWithRefs()

    const addToStore = (
      node: any,
      pathToSearch: string[],
      objType: keyof Store
    ) => {
      if (nodeTypeMap[node.nodeType] === objType) {
        let obj = this.store[objType][node.name]

        if (!obj) {
          const klass = this.store.getClass(objType)
          obj = new klass(node)
          this.store.addNode(obj, objType)
        }
        obj.bumpScore()
      }
    }

    traverse(project).forEach(function (item: any) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        if (this.node.name && typeof this.node.name === 'string') {
          addToStore(this.node, this.path.slice(), 'views')
          addToStore(this.node, this.path.slice(), 'stories')
          addToStore(this.node, this.path.slice(), 'components')
          addToStore(this.node, this.path.slice(), 'endpoints')
          addToStore(this.node, this.path.slice(), 'flows')
        }
      }
    })

    const errors = []

    this.store.getEntries().map(item => {
      errors.push(...item.validateDependencies())
    })

    if (errors.length > 0) {
      errors.map(item => console.warn(`[ERR]: ${item}`))
      // tslint:disable-next-line:no-console
      console.timeEnd('Done in')
    } else {
      new FileGenerator(this.store).generateComponents().then(a => {
        // tslint:disable-next-line:no-console
        console.timeEnd('Done in')
      })
    }

  }

  getNodesByType(nodeType: string) {
    return []
  }
}
