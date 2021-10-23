const routes = require('./routes');
const express = require('express')
const app = express()
const port = process.env.port || 3000
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Usuarios',
      version: '1.0.0',
    },
  },
  apis: ['routes.js'], // files containing annotations
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification))

app.use(express.json());

routes.setup(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})