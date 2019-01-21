import format from 'chalk'
import {table, getBorderCharacters} from 'table'
import orderBy from 'lodash.orderby'
import {Store} from './projectNodes'

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
        0: { width: 10},
        1: { width: 10},
        2: { width: 100},
    }
  }
  
  console.log(table(tableData, options))
}

export const nodeTypeMap = {
  'story': 'stories',
  'endpoint': 'endpoints',
  'component': 'components',
  'view': 'views',
  'flow': 'flows'
}