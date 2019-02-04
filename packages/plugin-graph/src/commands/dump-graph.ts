import {getSchemaWithRefs} from '@flow/schema-reader'
import {Command} from '@oclif/command'
import * as traverse from 'traverse'

import {alg, Graph, json} from 'graphlib'

function testWhite(x) {
  let white = new RegExp(/^\s$/)
  return white.test(x.charAt(0))
}

function wordWrap(str, maxWidth) {
  let newLineStr = '\n'
  let done = false
  let res = ''
  let found = false
  do {
    found = false
      // Inserts new line at first whitespace of the line
    let i = 0
    for (i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('')
        str = str.slice(i + 1)
        found = true
        break
      }
    }
      // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('')
      str = str.slice(maxWidth)
    }

    if (str.length < maxWidth)
      done = true
  } while (!done)

  return res + str
}

export default class List extends Command {
  static description = 'print schema in JSON'

  async run() {
    const projectWithoutRefs = await getSchemaWithRefs()

    let lastNode = null
    let lastLevel = null
    let lastParent = null
    let lastParentIndex = -1

    const flowGraph = new Graph({})
    const nodes = traverse(projectWithoutRefs.flows).nodes().filter(node => (node && typeof node === 'object' && node.nodeType))
    let nodeIndex = 0

    // console.log(nodes)
    // process.exit()

    nodes.forEach(node => {
      const nodeId = `${node.nodeType}-${node.name}`
      flowGraph.setNode(nodeId, {label: wordWrap(node.name, 30), class: node.nodeType})

      if (node.links) {
        node.links.forEach(linkNode => {
          const parentId = `${linkNode.nodeType}-${linkNode.name}`
          flowGraph.setEdge(parentId, nodeId, {label: ''})
        })
      }
    })

    // traverse(projectWithoutRefs).forEach(function (node) {
    //   if (node && typeof node === 'object' && node.nodeType) {

    //     console.log('XXX', [this.node])

    //     if (this.level !== lastLevel) {
    //       lastParent = lastNode
    //       lastParentIndex += 1
    //     }
    //     if (this.level < lastLevel) {
    //       lastParent = null
    //     }

    //     const parent = lastParent ? lastParent : null

    //     nodes.push(node)
    //     const nodeId = `${node.nodeType}-${node.name}`

    //     flowGraph.setNode(nodeId, {label: node.name, class: 'type-TOP'})
    //     // flowGraph.setNode(nodeIndex, {label: node.name, class: 'type-TOP'})

    //     if (parent) {
    //       const parentId = `${parent.nodeType}-${parent.name}`
    //       flowGraph.setEdge(parentId, nodeId, {label: 'xxx'})
    //     }

    //     nodeIndex += 1

    //     if (this.level !== lastLevel) {
    //       lastNode = node
    //     }
    //     lastLevel = this.level
    //   }
    // })

    // tslint:disable-next-line:no-console
    // console.log(JSON.stringify(projectWithoutRefs, null, 2))
    // console.log(alg.components(flowGraph))
    // console.log(nodes.map(node => node.name))
    // console.log(flowGraph.nodes())
    console.log(`var code = ${JSON.stringify(json.write(flowGraph))}`)
  }
}
