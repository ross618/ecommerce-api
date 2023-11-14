// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'Ecommerce API docs',
    description: 'Basic swagger API list',
  },
  host: 'localhost:8085',
  basePath: '/',
  schemes: ['http', 'https'],
};

const outputFile = './path/swagger-output.json';
const endpointsFiles = ['./app.ts'];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
