import { Store } from '../projectNodes'
import { SocketGenerator } from './socket'
import { ComponentGenerator } from './component';

export class FileGenerator {
  store: Store
  socketGenerator: SocketGenerator
  componentGenerator: ComponentGenerator
  
  constructor(store: Store) {
    this.store = store
    this.componentGenerator = new ComponentGenerator(this.store.components)
  }

  generateComponents() {
    this.componentGenerator.generate()
  }
}