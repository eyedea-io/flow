import axios from 'axios'
import jsf from 'json-schema-faker'


export default class PostmanCollection {
  constructor (context) {
    this.context = context
  }
  async run ([apiName]) {

    const collection = {
      info: {
        name: apiName,
        description: `API Documentation for ${apiName} project`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: []
    }

    const sockets = await this.context.Socket.list()

    sockets.forEach(socket => {
      collection.item.push({
        name: socket.name,
        description: socket.description,
        item: socket.getEndpoints().map(endpoint => {
          let rawBody = ''
          try {
            rawBody = jsf.generate(endpoint.metadata.inputs)
          } catch(err) {}
  
          return {
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
                raw: `https://{{SYNCANO_HOST}}/v3/instances/:instance_name/endpoints/sockets/${socket.name}/${endpoint.name}/`,
                protocol: 'https',
                host: ['{{SYNCANO_HOST}}'],
                path: [
                  'v3', 'instances', ':instance_name', 'endpoints', 'sockets', socket.name, endpoint.name, ''
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
        })
      })
    })

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
    }
  }
}