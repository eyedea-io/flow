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
          const filePath = join(v.absolutePath, `${v.normalizedName}.tsx`)
          const components = (v.node.components || []).map(item => this.nodes[item.name])

          fs.exists(filePath, async (exists) => {
            const imports = components.map(item => ({
              name: item.node.name,
              path: relative(v.path, item.path),
            })).concat({
              name: 'Props',
              path: `./${v.normalizedName}.types`
            })

            const options = {
              node: v.node,
              normalizedName: v.normalizedName,
              imports: sortBy(imports, 'name'),
              props: v.node.props || {}
            }

            templates.types(options).then(content => {
              fs.writeFile(join(v.absolutePath, `${v.normalizedName}.types.ts`), content, () => {})
            })

            if (exists) {
              fs.readFile(filePath, {
                encoding: 'utf8'
              }, (err, data) => {
                if (err) {
                  console.log(err)
                }
                if (options.imports) {
                  let content = this.replaceTag(data, 'imports', templates.imports(options))
                  content = content.trimRight()
                  content += '\n'
                  fs.writeFile(filePath, content, () => {})
                }
              })
              return
            }
            fs.writeFile(join(v.absolutePath, `index.tsx`), templates.index(options), () => {})
            fs.writeFile(join(v.absolutePath, `styled.tsx`), templates.styled(options), () => {})
            fs.writeFile(join(v.absolutePath, `${v.normalizedName}.tsx`), templates.component(options), () => {})
          })
        })
      })
  }
}