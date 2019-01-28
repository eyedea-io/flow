import {Command} from '@oclif/command'
import fs from 'fs'
import path from 'path'
import traverse from 'traverse'
import {ENTITIES} from '../../constants'
import {FileGenerator} from '../../generators/file'
import {Store} from '../../projectNodes'
import {SchemaReader} from '../../schemaReader'
import {nodeTypeMap} from '../../utils'

export default class Generate extends Command {
  static description = 'bootstrap files from schema'
  static examples = ['$ <%- config.bin %> generate']
  store = new Store()

  async getProjectSchema() {
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
      // .reduce((all, item) => ({...all, ...item}), {})

    console.log(schema)
    const reader = new SchemaReader(schema)

    reader.validateSchema()

    return reader.getSchemaWithRefs()
  }

  async run() {
    // tslint:disable-next-line:no-console
    console.time('Done in')
    const {args, flags} = this.parse(Generate)
    const project = await this.getProjectSchema()

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

    traverse(project).forEach(function(item: any) {
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
      new FileGenerator(this.store).generateComponents().then((a) => {
        // tslint:disable-next-line:no-console
        console.timeEnd('Done in')
      })
    }

  }

  getNodesByType(nodeType: string) {
    return []
  }
}
