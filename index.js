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
  apis: ['index.js'], // files containing annotations
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification))

app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     description: Prueba temporaria de base de datos
 *     responses:
 *       200:
 *         description: Devuelve DATA 123
 */
app.get('/', (req, res) => {
    var pgp = require('pg-promise')(/* options */)
    var db = pgp('postgresql://postgres:postgres@localhost/postgres')
    
    db.one('SELECT $1 AS value', 123)
      .then(function (data) {
        res.send('DATA:' + data.value)        
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })    
})

app.get('/user/:username', (req, res) => {
  var pgp = require('pg-promise')(/* options */)
  var db = pgp('postgresql://postgres:postgres@localhost/postgres')
  
  db.one('SELECT * FROM usuarios WHERE username == $1', req.params.username)
    .then(function (data) {
      res.send('DATA:' + data.value)        
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })    
})

app.post('/user', (req, res) => {
  var pgp = require('pg-promise')(/* options */)
  var db = pgp('postgresql://postgres:postgres@localhost/postgres')
  
  db.one('SELECT * FROM usuarios WHERE username == $1', req.params.username)
    .then(function (data) {
      res.send('DATA:' + data.value)        
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })    
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})