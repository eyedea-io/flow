import { ProjectNode } from '../projectNodes'

export class BaseGenerator {
  nodes: Record<string, ProjectNode>

  constructor(projectNodes: Record<string, ProjectNode>) {
    this.nodes = projectNodes
  }
}