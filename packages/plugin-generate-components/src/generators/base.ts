import {ProjectNode} from '@flow/schema-reader'

export class BaseGenerator {
  nodes: Record<string, ProjectNode>

  constructor(projectNodes: Record<string, ProjectNode>) {
    this.nodes = projectNodes
  }
}
