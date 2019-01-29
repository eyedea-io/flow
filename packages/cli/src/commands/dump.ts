import fs from "fs"
import path from "path"
import traverse from "traverse"

import { SchemaReader } from "../schemaReader"
import { ENTITIES } from "../constants"
import { printOrdered } from "../utils"

import { Component, View, Endpoint, Flow, Story, Store } from "../projectNodes"
import { Command, flags } from "@oclif/command"

export default class List extends Command {
  static description = "print schema in JSON"

  async run() {
    // const { args, flags } = this.parse(List)
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
    console.log(JSON.stringify(projectWithoutRefs, null, 2))
  }
}
