// import path from 'path'
// import traverse from 'traverse'

// import {SchemaReader} from './schemaReader'
// import {printOrdered, getTypeFromPath} from './utils'

// import {
//   Component,
//   View,
//   Endpoint,
//   Flow,
//   Story,
//   Store,
// } from './projectNodes'


// async function main () {
//   const projectSchema = path.join(__dirname, '../src/schema/winvest.yml')
//   const socketsSchema = path.join(__dirname, '../src/schema/sockets.yml')
//   const reader = new SchemaReader(projectSchema, [socketsSchema])

//   reader.init()
//   reader.validateSchema()

//   const projectWithoutRefs = await reader.getSchemaWithRefs()

//   const store = new Store()
  

//   const countObjects = (node: any, pathToSearch: string[], objType: keyof Store) => {
//     if (getTypeFromPath(pathToSearch) === objType) {
//       let obj = store[objType][node.name]
//       if (!obj) {
//         const class_ = store.getClass(objType)
//         obj = new class_(node)
//         store.addNode(obj, objType)
//       }
//       obj.bumpScore()
//     }
//   }

//   traverse(projectWithoutRefs).forEach(function (item) {
//     if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
//       if (this.node.name) {
//         countObjects(this.node, this.path.slice(), 'views')
//         countObjects(this.node, this.path.slice(), 'stories')
//         countObjects(this.node, this.path.slice(), 'components')
//         countObjects(this.node, this.path.slice(), 'endpoints')
//         countObjects(this.node, this.path.slice(), 'flows')
//       }
//     }
//   })

//   console.log()
//   printOrdered('endpoints', store)
//   printOrdered('components', store)
//   printOrdered('views', store)
//   printOrdered('stories', store)

// }

// main()