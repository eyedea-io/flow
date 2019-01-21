import fs from "fs"
import path from "path"
import traverse from "traverse"

import { SchemaReader } from "../schemaReader"
import { ENTITIES } from "../constants"
import { printOrdered, nodeTypeMap } from "../utils"

import { Component, View, Endpoint, Flow, Story, Store } from "../projectNodes"
import { Command, flags } from "@oclif/command"

export default class List extends Command {
  static description = "list all objects"

  //   static flags = {
  //     help: flags.help({char: 'h'}),
  //     // flag with a value (-n, --name=VALUE)
  //     name: flags.string({char: 'n', description: 'name to print'}),
  //     // flag with no value (-f, --force)
  //     force: flags.boolean({char: 'f'}),
  //   }
  //   static args = [{name: 'file'}]

  async run() {
    const { args, flags } = this.parse(List)
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
          const class_ = store.getClass(objType)
          obj = new class_(node)
          store.addNode(obj, objType)
        }
        obj.bumpScore()
      }
    }

    traverse(projectWithoutRefs).forEach(function(item) {
      if (item) {
        countObjects(this.node, this.path.slice(), 'views')
        countObjects(this.node, this.path.slice(), 'stories')
        countObjects(this.node, this.path.slice(), 'components')
        countObjects(this.node, this.path.slice(), 'endpoints')
        countObjects(this.node, this.path.slice(), 'flows')
      }
    })

    console.log()
    printOrdered("endpoints", store)
    printOrdered("components", store)
    printOrdered("views", store)
    printOrdered("stories", store)
    printOrdered("flows", store)
  }
}
