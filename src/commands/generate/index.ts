import { Command } from "@oclif/command"
import { ENTITIES } from '../../constants'
import { Store } from '../../projectNodes';
import { SchemaReader } from '../../schemaReader';
import path from 'path'
import fs from 'fs'
import { getTypeFromPath } from '../../utils';
import traverse = require('traverse');
import { FileGenerator } from '../../generators/file';

export default class Generate extends Command {
  static description = "bootstrap files from schema"
  static examples = ['$ <%- config.bin %> generate']
  store = new Store()

  async getProjectSchema() {
    const [projectSchema, ...additionalSchemas] = ENTITIES.map(item => {
      const schemaPath = path.join(process.cwd(), `./schema/${item}.js`)

      if (fs.existsSync(schemaPath)) {
        return {
          $id: `#${item}`,
          ...require(schemaPath),
        }
      }
    }).filter(Boolean)

    const reader = new SchemaReader(projectSchema, additionalSchemas)

    reader.init()
    reader.validateSchema()

    return reader.getSchemaWithRefs()
  }

  async run() {
    const { args, flags } = this.parse(Generate)
    const project = await this.getProjectSchema()

    const addToStore = (
      node: any,
      pathToSearch: string[],
      objType: keyof Store
    ) => {
      if (getTypeFromPath(pathToSearch) === objType) {
        let obj = this.store[objType][node.name]
        
        if (!obj) {
          const class_ = this.store.getClass(objType)
          obj = new class_(node)
          this.store.addNode(obj, objType)
        }
        obj.bumpScore()
      }
    }

    traverse(project).forEach(function(item) {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        if (this.node.name && typeof this.node.name === 'string') {
          addToStore(this.node, this.path.slice(), "views")
          addToStore(this.node, this.path.slice(), "stories")
          addToStore(this.node, this.path.slice(), "components")
          addToStore(this.node, this.path.slice(), "endpoints")
          addToStore(this.node, this.path.slice(), "flows")
        }
      }
    })

    new FileGenerator(this.store).generateComponents()
  }

  getNodesByType(nodeType: string) {
    return []
  }
}
