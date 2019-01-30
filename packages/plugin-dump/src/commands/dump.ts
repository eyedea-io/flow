import {getSchemaWithRefs} from '@flow/schema-reader'
import {Command} from '@oclif/command'

export default class List extends Command {
  static description = 'print schema in JSON'

  async run() {
    const projectWithoutRefs = await getSchemaWithRefs()

    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(projectWithoutRefs, null, 2))
  }
}
