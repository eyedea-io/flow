import { ProjectNode } from '../projectNodes';
import { BaseGenerator } from './base';

export class SocketGenerator extends BaseGenerator {
  constructor(projectNodes: Record<string, ProjectNode>) {
    super(projectNodes)
  }

  generate() {
    console.log(this.nodes)
  }
}