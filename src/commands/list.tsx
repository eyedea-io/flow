import fs from 'fs'
import path from 'path'
import traverse from 'traverse'

import {ENTITIES} from '../constants'
import {SchemaReader} from '../schemaReader'
import {nodeTypeMap, printOrdered} from '../utils'

import {Command} from '@oclif/command'
import {Store} from '../projectNodes'

export default class List extends Command {
  static description = 'list all objects'

  //   static flags = {
  //     help: flags.help({char: 'h'}),
  //     // flag with a value (-n, --name=VALUE)
  //     name: flags.string({char: 'n', description: 'name to print'}),
  //     // flag with no value (-f, --force)
  //     force: flags.boolean({char: 'f'}),
  //   }
  //   static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(List)
    const schema = ENTITIES
      .map(item => {
        const schemaPath = path.join(process.cwd(), `./schema/${item}.js`)

        if (fs.existsSync(schemaPath)) {
          return {
            $id: `#${item}`,
            ...require(schemaPath),
          }
        }
      })
      .filter(Boolean)
      .reduce((all, item) => ({...all, ...item}), {})

    const reader = new SchemaReader(schema)

    reader.init()
    reader.validateSchema()

    const projectWithoutRefs = await reader.getSchemaWithRefs()
    const store = new Store()

    const countObjects = (
      node: any,
      pathToSearch: string[],
      objType: keyof Store
    ) => {
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

    traverse(projectWithoutRefs).forEach(function(item: any) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        if (this.node.name && typeof this.node.name === 'string') {
          countObjects(this.node, this.path.slice(), 'views')
          countObjects(this.node, this.path.slice(), 'stories')
          countObjects(this.node, this.path.slice(), 'components')
          countObjects(this.node, this.path.slice(), 'endpoints')
          countObjects(this.node, this.path.slice(), 'flows')
        }
      }
    })

    printOrdered('endpoints', store)
    printOrdered('components', store)
    printOrdered('views', store)
    printOrdered('stories', store)
    printOrdered('flows', store)
  }
}
