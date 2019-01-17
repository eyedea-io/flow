import { Command, flags } from "@oclif/command"

export default class Update extends Command {
  static description = "Update files"

  async run() {
    const { args, flags } = this.parse(Update)
  }
}
