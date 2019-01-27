import fs from 'fs-extra'
import sortBy from 'lodash.sortby'
import {join, relative} from 'path'
import {ProjectNode} from '../../projectNodes'
import {BaseGenerator} from '../base'
import * as templates from './templates'

export class ComponentGenerator extends BaseGenerator {
  constructor(projectNodes: Record<string, ProjectNode>) {
    super(projectNodes)
  }

  replaceTag(content: string, tag: string, body: string): string {
    let result = content

    if (!result) {
      return result
    }

    if (result.includes(`\/\/ ${tag}`)) {
      if (result.includes(`\/\/ ${tag}-end`)) {
        result = result.replace(new RegExp(`\/\/ ${tag}(.|\n)*\/\/ ${tag}-end`, 'm'), `\/\/ ${tag}`)
      }
    }

    return result.replace(`\/\/ ${tag}`, `\/\/ ${tag}\n${body}\n\/\/ ${tag}-end`)
  }

  regenerateImports({componentPath, options}: any) {
    return fs.readFile(componentPath, {
      encoding: 'utf8',
    })
      .then(data => {
        if (options.imports) {
          let content = this.replaceTag(data, 'imports', templates.imports(options))
          content = content.trimRight()
          content += '\n'
          fs.writeFile(componentPath, content)
        }
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          // tslint:disable-next-line:no-console
          console.error(`Component file doesn't exist: "${componentPath}"`)
        }
      })
  }

  regenerateTypes({options, v}: any) {
    return templates.types(options).then(content => {
      fs.writeFile(join(v.absolutePath, `${v.normalizedName}.types.ts`), content)
    })
  }

  generate() {
    const promises = Object.entries(this.nodes)
      .map(([k, v]) => new Promise(resolve => {
        fs.mkdirp(v.absolutePath, () => {
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
              path: `./${v.normalizedName}.types`,
            })
            imports = sortBy(imports, ['path'])

            const options = {
              node: v.node,
              normalizedName: v.normalizedName,
              imports,
              props: {
                additionalProperties: false,
                ...(v.node.props || {}),
              },
            }

            if (exists) {
              return resolve([
                this.regenerateTypes({options, v}),
                this.regenerateImports({componentPath, options}),
              ])
            }

            return resolve([
              this.regenerateImports({componentPath, options}),
              fs.writeFile(indexPath, templates.index(options)),
              fs.writeFile(stylePath, templates.styled(options)),
              fs.writeFile(fixturePath, templates.fixture(options)),
              fs.writeFile(componentPath, templates.component(options)),
            ])
          })
        })
      }))

    return Promise.all(promises).then((items) => {
      return Promise.all([].concat.apply([], items))
    })
  }
}
