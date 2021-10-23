const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

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