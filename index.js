require('dotenv').config()

const { buildApp } = require('./app')
const { db } = require('./db')

const app = buildApp(db)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
