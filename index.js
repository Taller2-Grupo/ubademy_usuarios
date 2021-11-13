require('dotenv').config()

const routes = require('./routes')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const { db } = require('./db')

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

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = { app, server }
