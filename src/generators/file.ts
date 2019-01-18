import { Store } from '../projectNodes'
import { SocketGenerator } from './socket'

export class FileGenerator {
  store: Store
  socketGenerator: SocketGenerator
  
  constructor(store: Store) {
    this.store = store
    this.socketGenerator = new SocketGenerator(this.store.endpoints)
    // this.componentGenerator = new ComponentGenerator(this.store.components)
  }

  generateSockets() {
    this.socketGenerator.generate()
    // this.componentGenerator.generate()
  }
}