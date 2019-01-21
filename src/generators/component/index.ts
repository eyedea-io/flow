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
    if (content.includes(`\/\/ ${tag}`)) {
      if (content.includes(`\/\/ ${tag}end`)) {
        content = content.replace(new RegExp(`\/\/ ${tag}(.|\n)*\/\/ ${tag}end`, 'm'), `\/\/ ${tag}`)
      }
    }
    return content.replace(`\/\/ ${tag}`, `\/\/ ${tag}\n${body}\n\/\/ ${tag}end`)
  }

  generate() {
    Object.entries(this.nodes)
      .forEach(([k, v]) => {
        mkdir(v.absolutePath, () => {
          const filePath = join(v.absolutePath, `${v.normalizedName}.tsx`)
          const components = (v.node.components || []).map(item => this.nodes[item.name])

          fs.exists(filePath, async (exists) => {
            const imports = sortBy(components.map(item => ({
              name: item.node.name,
              path: relative(v.path, item.path),
            })).concat({
              name: 'Props',
              path: `./${v.normalizedName}.types`
            }), 'name')
            const props = {
              name: v.node.name,
              normalizedName: v.normalizedName,
              imports
            }
            
            if (exists) {
              fs.readFile(filePath, {
                encoding: 'utf8'
              }, (err, data) => {
                if (err) {
                  console.log(err)
                }
                if (props.imports) {
                  let content = this.replaceTag(data, 'imports', templates.imports(props))
                  content = content.trimRight()
                  content += '\n'
                  fs.writeFile(filePath, content, () => {})
                }
              })
              return
            }
            fs.writeFile(join(v.absolutePath, `index.tsx`), templates.index(props), () => {})
            fs.writeFile(join(v.absolutePath, `styled.tsx`), templates.styled(props), () => {})
            fs.writeFile(join(v.absolutePath, `${v.normalizedName}.types.ts`), templates.types, () => {})
            fs.writeFile(join(v.absolutePath, `${v.normalizedName}.tsx`), templates.component(props), () => {})
          })
        })
      })
  }
}