// flow: imports

// flow

import path from 'path'
import fs from 'fs'
import logger from 'debug'

const log = logger('projectNodes')

class ProjectNode {
  name: string
  score: number
  node: any

  constructor(node: any) {
    this.name = node.name
    this.node = node
    this.score = 0
  }

  public bumpScore(points = 1) {
    this.score += points
  }

  getObjectComplexity(store: Store, objectType) {
    let complexity = 0
    this.node[objectType].forEach((item: any) => {
      const o = store.getObjectByNameAndType(item.name, objectType)
      complexity += o.calculateComplexity(store)
    })
    return complexity
  }
}

export class Component extends ProjectNode {
  exist: boolean
  path: string

  constructor(node: any){
    super(node)

    this.path = path.join(
      process.cwd(),
      'workspaces',
      this.node.env,
      'components',
      this.name.toLowerCase(),
      `${this.name.toLowerCase()}.type.ts`
    )
    this.checkIfExist()
  }
  calculateComplexity = () => {
    return 1
  }
  async checkIfExist () {
    this.exist = fs.existsSync(this.path) 
  }
}

export class View extends ProjectNode {
  calculateComplexity = (store: Store) => {
    let complexity = 1
    if (this.node.components) {
      complexity += this.getObjectComplexity(store, 'components')
    }
    if (this.node.endpoints) {
      complexity += this.getObjectComplexity(store, 'endpoints')
    }
    return complexity
  }
}
export class Story extends ProjectNode {
  calculateComplexity = (store: Store) => {
    let complexity = 1
    if (this.node.views) {
      complexity += this.getObjectComplexity(store, 'views')
    }
    return complexity
  }
}
export class Flow extends ProjectNode {
  calculateComplexity = (store: Store) => {
    let complexity = 1
    if (this.node.stories) {
      complexity += this.getObjectComplexity(store, 'stories')
    }
    return complexity
  }
}

export class Endpoint extends ProjectNode {
  calculateComplexity = () => {
    let complexity = 1
    return complexity
  }
}

export class Store {
  components: Record<string, Component>
  views: Record<string, View>
  stories: Record<string, Story>
  endpoints: Record<string, Endpoint>
  flows: Record<string, Flow>

  private classMap = {
    views: View,
    components: Component,
    endpoints: Endpoint,
    stories: Story,
    flows: Flow,
  }

  constructor () {
    this.components = {}
    this.views = {}
    this.stories = {}
    this.endpoints = {}
    this.flows = {}
  }

  public getClass(typeName) {
    return this.classMap[typeName]
  }

  addView (view: View) {
    this.views[view.name] = view
  }

  addNode (node: any, nodeType: keyof Store) {
    this[nodeType][node.name] = node
  }

  getViewByName (name: string): View {
    return this.views[name]
  }

  getEndpointByName (name: string): Endpoint {
    return this.endpoints[name]
  }
  
  getStoryByName (name: string): Story {
    return this.stories[name]
  }

  getComponentByName (name: string): Component {
    return this.components[name]
  }

  getObjectByNameAndType (name, objType) {
    return this[objType][name]
  }
}
