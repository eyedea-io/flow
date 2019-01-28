import Ajv from 'ajv'
import ProjectSchema from './schema'
import RefParser from 'json-schema-ref-parser'


export class SchemaReader {

  schema: object;
  private validate: Ajv.ValidateFunction;

  constructor(schema: object) {
    this.schema = schema
    this.init();
  }

  init() {
    const ajv = new Ajv({ coerceTypes: true });

    this.validate = ajv.compile(ProjectSchema);
  }

  validateSchema() {
    return this.validate(this.schema);
  }

  async getSchemaWithRefs() {
    return RefParser.dereference(this.schema);
  }
}
