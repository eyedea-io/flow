
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import Ajv from 'ajv'
import ProjectSchema from './schema'
import RefParser from 'json-schema-ref-parser'


export class SchemaReader {
  mainSchemaYML: Buffer;
  mainSchemaJSON: Buffer;
  additionalSchemas: Buffer[];
  private validate: Ajv.ValidateFunction;

  constructor(mainSchemaYML: string, additionlSchemas: string[]) {
    this.mainSchemaYML = fs.readFileSync(mainSchemaYML);
    this.mainSchemaJSON = yaml.load(this.mainSchemaYML.toString());

    this.additionalSchemas = additionlSchemas.map(schema => {
      return fs.readFileSync(path.join(schema));
    });

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
    return RefParser.dereference(this.mainSchemaJSON);
  }
}
