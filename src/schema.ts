export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    component: {},
    endpoint: {},
    story: {
      properties: {
        views: {
          type: 'array',
          items: {
            $ref: '#/definitions/view',
          },
        },
      },
    },
    flow: {
      properties: {
        stories: {
          type: 'array',
          items: {
            $ref: '#/definitions/story',
          },
        },
      },
    },
    view: {
      properties: {
        deps: {
          type: 'object',
          properties: {
            components: {
              type: 'array',
              items: {
                $ref: '#/definitions/component',
              },
            },
            endpoints: {
              type: 'array',
              items: {
                $ref: '#/definitions/endpoint',
              },
            },
          },
        },
      },
    },
  },
  properties: {
    // views: {
    //   patternProperties: {
    //     '.*': {
    //       $ref: '#/definitions/view'
    //     }
    //   }
    // },
    // stories: {
    //   patternProperties: {
    //     '.*': {
    //       $ref: '#/definitions/story'
    //     }
    //   }
    // },
    // flows: {
    //   type: 'array',
    //   items: [{
    //     properties: {
    //       required: ['name'],
    //       name: {
    //         type: 'string'
    //       }
    //     }
      //   {
      //   title: 'Name of the socket',
      //   type: 'string',
      //   maxLength: 64,
      //   pattern: '^[?:a-z0-9-_]*$'
      // }
      // patternProperties: {
      //   '.*': {
      //     $ref: '#/definitions/flow'
      //   }
      // }
  //   },
  //   name: {
  //     title: 'Name of the socket',
  //     type: 'string',
  //     maxLength: 64,
  //     pattern: '^[?:a-z0-9-_]*$'
  //   }
  // },
  // required: ['name']
    flows: {
      type: 'object',
      items: {
        required: ['aname'],
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
  },
}
