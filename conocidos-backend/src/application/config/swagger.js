export const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          name: 'x-access-token',
          in: 'header',
        },
      },
    },
    security: [
      { ApiKeyAuth: [] },
    ],
    securityDefinitions: {
      basicAuth: {
        type: 'basic'
      },
    },
  },
  // Path to the API docs
  apis: ['./src/entities/**/*.js', './src/entities/**/*.yml'],
};

