const promise = require('bluebird')
const pgPromise = require('pg-promise')
const { Usuarios } = require('./repos')

const connectionString = process.env.DATABASE_URL

const initOptions = {
  promiseLib: promise,
  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend (obj, dc) {
    // Database Context (dc) is mainly useful when extending multiple databases with different access API-s.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    obj.usuarios = new Usuarios(obj, pgp)
  }
}

const pgp = pgPromise(initOptions)

if (process.env.NODE_ENV === 'production') {
  pgp.pg.defaults.ssl = {
    rejectUnauthorized: false
  }
}

const db = pgp(connectionString)

module.exports = { db, pgp }
