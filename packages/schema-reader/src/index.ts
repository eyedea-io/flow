import path from 'path'
import fs from 'fs'

import { SchemaReader } from './schemaReader'
import {ENTITIES} from './constants'
import {ProjectNode} from './projectNodes'
import {Store} from './projectNodes'
import {nodeTypeMap} from './utils'

const getSchemaWithRefs = () => {
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

export {
  getSchemaWithRefs,
  SchemaReader,
  ENTITIES,
  nodeTypeMap,
  ProjectNode,
  Store
}
