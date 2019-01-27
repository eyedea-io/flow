import fs from 'fs'
import path from 'path'

import {ENTITIES} from '../constants'
import {SchemaReader} from '../schemaReader'

import {Command} from '@oclif/command'

export default class List extends Command {
  static description = 'print schema in JSON'

  async run() {
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
    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(projectWithoutRefs, null, 2))
  }
}
