import path from 'path'
import fs from 'fs'
import kebabCase from 'lodash.kebabcase'

export class ProjectNode {
  name: string
  score: number
  node: any
  nodeType: string
  path?: string
  absolutePath?: string
  config = {
    srcDir: '/src/',
    componentsDir: '/components/',
  }

  constructor(node: any) {
    this.name = node.name
    this.node = node
    this.score = 0
    this.getConfig()
  }

  private getConfig = () => {
    const configPath = path.join(process.cwd(), `./schema/schema.config.js`)

    if (fs.existsSync(configPath)) {
      const config = require(configPath)

      this.config = {...this.config, ...config}
    }
  }

  public bumpScore(points = 1) {
    this.score += points
  }

  public validateDependencies(): string[] {
    const result = []
    const {views, components, stories, endpoints} = this.node
    const arr = {views, components, stories, endpoints}

    Object.keys(arr).filter(key => arr[key]).map(nodeType => {
      const undefinedEntries = arr[nodeType].filter(item => item === undefined)

      if (undefinedEntries.length) {
        result.push(`${this.node.nodeType}.${this.name}.${nodeType} contains undefined entry.`)
      }
    })

    return result
  }

  getObjectComplexity(store: Store, objectType) {
    let complexity = 0
    if (this.node[objectType]) {
      this.node[objectType].forEach((item: any) => {
        const o = store.getObjectByNameAndType(item.name, objectType)
        complexity += o.calculateComplexity(store)
      })
    }
    return complexity
  }

  get normalizedName() {
    return kebabCase(this.node.name)
  }
}

export class Component extends ProjectNode {
  exist: boolean
  path: string
  absolutePath: string

  constructor(node: any){
    super(node)
    this.path = path.join(
      this.config.srcDir,
      this.node.workspace || '',
      this.config.componentsDir,
      this.normalizedName,
    )
    this.absolutePath = path.join(
      process.cwd(),
      this.config.srcDir,
      this.node.workspace || '',
      this.config.componentsDir,
      this.normalizedName,
      // `${this.node.name.toLowerCase()}.type.ts`
    )
    this.checkIfExist()
  }

  calculateComplexity(store: Store) {
    let complexity = 1

    if (this.node.components) {
      complexity += this.getObjectComplexity(store, 'components')
    }

    return complexity
  }

  async checkIfExist () {
    this.exist = fs.existsSync(this.absolutePath)
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

export class ViewStory extends ProjectNode {
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
  viewStories: Record<string, ViewStory>

  private classMap = {
    views: View,
    components: Component,
    endpoints: Endpoint,
    stories: Story,
    flows: Flow,
    viewStories: ViewStory,
  }

  constructor () {
    this.components = {}
    this.views = {}
    this.viewStories = {}
    this.stories = {}
    this.endpoints = {}
    this.flows = {}
  }

  public getClass(typeName) {
    return this.classMap[typeName]
  }

  public getEntries() {
    return [
      ...Object.values(this.components),
      ...Object.values(this.views),
      ...Object.values(this.stories),
      ...Object.values(this.endpoints),
      ...Object.values(this.flows),
    ]
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
