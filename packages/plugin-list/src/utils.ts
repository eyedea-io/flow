import {Store} from '@flow/schema-reader'
import format from 'chalk'
import orderBy from 'lodash.orderby'
import {getBorderCharacters, table} from 'table'

export const printOrdered = (objectType: string, store: Store) => {
  console.log(`${objectType}:`)

  // Get things from the store in form of array (only name and score properites)
  const objArray = Object.entries(store[objectType])
    .map(([key, value]: [string, any]) => ({
      name: objectType === 'endpoints' ? `${value.node.socket}/${key}` : key,
      score: value.score,
      description: value.node.description,
      complexity: value.calculateComplexity(store),
      exist: value.exist
    }))

  // Sort by score and then name
  const tableData = [
    ['score', 'complexity', objectType, 'exist'].map(item => format.grey(item))
  ]

  orderBy(objArray, ['score', 'complexity'], ['desc', 'asc']).forEach(element => {
    tableData.push([
      element.score,
      element.complexity,
      [element.name, format.magenta(element.description || '')].filter(Boolean).join(' - '),
      element.exist ? 'yes' : 'no'
    ])
  })

  const options = {
    border: getBorderCharacters('norc'),
    columns: {
      0: {width: 10},
      1: {width: 10},
      2: {width: 60},
    }
  }

  console.log(table(tableData, options))
}
