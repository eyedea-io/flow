import path from "path"
import traverse from "traverse"

import { SchemaReader } from "../schemaReader"
import { printOrdered, getTypeFromPath } from "../utils"

import { Component, View, Endpoint, Flow, Story, Store } from "../projectNodes"
import { Command, flags } from "@oclif/command"

export default class List extends Command {
  static description = "List all objects"

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

    const projectSchema = require(path.join(process.cwd(), "./schema/flows.js"))
    const endpointSchema = require(path.join(process.cwd(), "./schema/endpoints.js"))
    // const storiesSchema = path.join(process.cwd(), "./schema/stories.yml")
    // const componentsSchema = path.join(process.cwd(), "./schema/components.yml")
    const reader = new SchemaReader(projectSchema, [
      endpointSchema,
    //   storiesSchema,
    //   storiesSchema,
    //   componentsSchema
    ])

    reader.init()
    reader.validateSchema()

    const projectWithoutRefs = await reader.getSchemaWithRefs()

    const store = new Store()

    const countObjects = (
      node: any,
      pathToSearch: string[],
      objType: keyof Store
    ) => {
      if (getTypeFromPath(pathToSearch) === objType) {
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
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        if (this.node.name) {
          countObjects(this.node, this.path.slice(), "views")
          countObjects(this.node, this.path.slice(), "stories")
          countObjects(this.node, this.path.slice(), "components")
          countObjects(this.node, this.path.slice(), "endpoints")
          countObjects(this.node, this.path.slice(), "flows")
        }
      }
    })

    console.log()
    printOrdered("endpoints", store)
    printOrdered("components", store)
    printOrdered("views", store)
    printOrdered("stories", store)
  }
}
