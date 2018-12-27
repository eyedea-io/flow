import axios from 'axios'
import jsf from 'json-schema-faker'


export default class PostmanCollection {
  constructor (context) {
    this.context = context
  }
  async run ([apiName]) {

    if (!process.env.POSTMAN_API_KEY || !process.env.POSTMAN_COLLECTION_ID) {
      console.log('\n   You have to specify POSTMAN_API_KEY and POSTMAN_COLLECTION_ID.\n')
      process.exit(1)
    }

    const collection = {
      info: {
        name: apiName,
        description: `API Documentation for ${apiName} project`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: []
    }

    const sockets = await this.context.Socket.list()

    console.log()
    sockets.forEach(socket => {
      collection.item.push({
        name: socket.name,
        description: socket.description,
        item: socket.getEndpoints().map(endpoint => {
          console.log(`   Adding endpoint: ${socket.name}/${endpoint.name}`)
          let rawBody = ''
          try {
            rawBody = jsf.generate(endpoint.metadata.inputs)
          } catch(err) {}
  
          let rawUrl = 'https://{{SYNCANO_HOST}}/v3/instances/:instance_name/'
          rawUrl += `endpoints/sockets/${socket.name}/${endpoint.name}/`

          const endpointObj = {
            name: endpoint.name,
            request: {
              description: endpoint.metadata.description,
              method: 'POST',
              header: [
                {
                  key: 'x-user-key',
                  value: '{{x-user-key}}',
                  type: 'text'
                },
                {
                  "key": "Content-Type",
                  "name": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(rawBody, null, "  ")
              },
              url: {
                raw: rawUrl,
                protocol: 'https',
                host: ['{{SYNCANO_HOST}}'],
                path: [
                  'v3',
                  'instances',
                  ':instance_name',
                  'endpoints',
                  'sockets',
                  socket.name,
                  endpoint.name,
                  ''
                ],
                variable: [
                  {
                    'key': 'instance_name',
                    'value': '{{instance}}'
                  }
                ]
              }
            }
          }

          const outputs = endpoint.metadata.outputs

          if (outputs) {
            // Endpoint exit codes
            let exitCodes = [403]
            let responses = Object.keys(outputs).map(key => {
              if (key !== 'mimetype' && key !== 'exit_code') {
                return key
              }
            })
            responses = responses.filter(item => typeof item !== 'undefined')

            // Add possible codes from output
            exitCodes = exitCodes.concat(responses.map(output => {
              return outputs[output].exit_code || outputs.exit_code || 200
            }))

            exitCodes = exitCodes.filter((elem, pos) => {
              return exitCodes.indexOf(elem) == pos
            })

            endpointObj.event = [this.genExitCodeTest(exitCodes)]
          } else {
            endpointObj.event = [this.genExitCodeTest([200])]
          }

          return endpointObj
        })
      })
    })

    console.log()
    try {
      await axios.request({
        url: `https://api.getpostman.com/collections/${process.env.POSTMAN_COLLECTION_ID}`,
        method: 'PUT',
        headers: {
          'X-Api-Key': process.env.POSTMAN_API_KEY,
        },
        data: {collection}
      })
    } catch (err) {
      console.log('Error:', err)
      process.exit(1)
    }
  }

  genExitCodeTest(exitCodes) {
    return {
      listen: 'test',
      script: {
        exec: [
          `pm.test("Status code is one of [${exitCodes.join(', ')}]", function () {`,
          `    pm.response.to.have.property('code').oneOf([${exitCodes.join(', ')}]);`,
          '});',
          ''
        ],
        type: 'text/javascript'
      }
    }
  }
}