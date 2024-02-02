export const guideSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Generated schema for Root',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string'
            },
            parts: {
              type: 'array',
              items: {}
            },
            subSteps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string'
                  },
                  parts: {
                    type: 'array',
                    items: {}
                  },
                  subSteps: {
                    type: 'array',
                    items: {}
                  }
                },
                required: ['type', 'parts', 'subSteps']
              }
            }
          },
          required: ['type', 'parts', 'subSteps']
        }
      }
    },
    required: ['name', 'steps']
  }
};
