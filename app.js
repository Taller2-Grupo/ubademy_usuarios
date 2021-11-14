module.exports.buildApp = (db) => {
  const express = require('express')
  const app = express()
  const routes = require('./routes')
  const cors = require('cors')
  const swaggerJsdoc = require('swagger-jsdoc')
  const swaggerUI = require('swagger-ui-express')

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Usuarios',
        version: '1.0.0'
      }
    },
    apis: ['routes.js'] // files containing annotations
  }

  const openapiSpecification = swaggerJsdoc(options)
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification))

  app.use(express.json())

  app.use(cors())

  routes.setup(app, db)

  return app
}
