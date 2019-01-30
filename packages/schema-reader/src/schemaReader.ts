import Ajv from 'ajv'
import ProjectSchema from './schema'
import RefParser from 'json-schema-ref-parser'


export class SchemaReader {
  mainSchemaJSON: object;
  additionalSchemas: object[];
  private validate: Ajv.ValidateFunction;

  constructor(mainSchemaJSON: object, additionlSchemas: object[]) {
    this.mainSchemaJSON = mainSchemaJSON;
    this.additionalSchemas = additionlSchemas;
    this.init();
  }

  init() {
    const ajv = new Ajv({ coerceTypes: true });

    this.additionalSchemas.forEach(schema => {
      ajv.addSchema(schema);
    });

    this.validate = ajv.compile(ProjectSchema);
  }

  validateSchema() {
    return this.validate(this.validate);
  }

  async getSchemaWithRefs() {
    return RefParser.dereference(
      Object.assign(this.mainSchemaJSON, ...this.additionalSchemas.map(item => ({
        [item['$id'].substr(1)]: item
      })))
    );
  }
}
