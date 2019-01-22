import { ProjectNode } from '../../projectNodes';
import { BaseGenerator } from '../base';
import * as templates from './templates'
import sortBy from 'lodash.sortby'
import {join, relative} from 'path'
import mkdir from 'mkdirp'
import fs from 'fs'

export class ComponentGenerator extends BaseGenerator {
  constructor(projectNodes: Record<string, ProjectNode>) {
    super(projectNodes)
  }

  replaceTag(content: string, tag: string, body: string): string {
    if (!content) {
      return ''
    }

    if (content.includes(`\/\/ ${tag}`)) {
      if (content.includes(`\/\/ ${tag}-end`)) {
        content = content.replace(new RegExp(`\/\/ ${tag}(.|\n)*\/\/ ${tag}-end`, 'm'), `\/\/ ${tag}`)
      }
    }

    return content.replace(`\/\/ ${tag}`, `\/\/ ${tag}\n${body}\n\/\/ ${tag}-end`)
  }

  generate() {
    Object.entries(this.nodes)
      .forEach(([k, v]) => {
        mkdir(v.absolutePath, () => {
          const componentPath = join(v.absolutePath, `${v.normalizedName}.tsx`)
          const fixturePath = join(v.absolutePath, `${v.normalizedName}.fixture.tsx`)
          const indexPath = join(v.absolutePath, `index.tsx`)
          const components = (v.node.components || []).map(item => this.nodes[item.name])
          const stylePath = join(v.absolutePath, `${v.normalizedName}.styled.tsx`)

          fs.exists(componentPath, async (exists) => {
            let imports = components.map(item => ({
              name: item.node.name,
              path: relative(v.path, item.path),
            })).concat({
              name: 'Props',
              path: `./${v.normalizedName}.types`
            })
            imports = sortBy(imports, ['path'])

            const options = {
              node: v.node,
              normalizedName: v.normalizedName,
              imports,
              props: {
                additionalProperties: false,
                ...(v.node.props || {})
              }
            }

            templates.types(options).then(content => {
              fs.writeFile(join(v.absolutePath, `${v.normalizedName}.types.ts`), content, () => {})
            })

            if (exists) {
              fs.readFile(componentPath, {
                encoding: 'utf8'
              }, (err, data) => {
                if (err && err.code === 'ENOENT') {
                  console.error(`Component file doesn't exist: "${componentPath}"`)
                } else if (options.imports) {
                  let content = this.replaceTag(data, 'imports', templates.imports(options))
                  content = content.trimRight()
                  content += '\n'
                  fs.writeFile(componentPath, content, () => {})
                }
              })
              return
            }
            fs.writeFile(indexPath, templates.index(options), () => {})
            fs.writeFile(stylePath, templates.styled(options), () => {})
            fs.writeFile(fixturePath, templates.fixture(options), () => {})
            fs.writeFile(componentPath, templates.component(options), () => {})
          })
        })
      })
  }
}