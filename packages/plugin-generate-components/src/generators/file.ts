import {Store} from '@flow/schema-reader'

import {ComponentGenerator} from './component'
import {SocketGenerator} from './socket'

export class FileGenerator {
  store: Store
  socketGenerator: SocketGenerator
  componentGenerator: ComponentGenerator
  constructor(store: Store) {
    this.store = store
    this.componentGenerator = new ComponentGenerator(this.store.components)
  }

  generateComponents() {
    return this.componentGenerator.generate()
  }
}
