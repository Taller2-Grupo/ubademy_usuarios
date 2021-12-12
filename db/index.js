const promise = require('bluebird')
const pgPromise = require('pg-promise')
const { Usuarios, Eventos } = require('./repos')

let connectionString = process.env.DATABASE_URL

if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.TEST_DATABASE_URL
}

const initOptions = {
  promiseLib: promise,
  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend (obj, dc) {
    // Database Context (dc) is mainly useful when extending multiple databases with different access API-s.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    obj.usuarios = new Usuarios(obj, pgp)
    obj.eventos = new Eventos(obj, pgp)
  }
}

const pgp = pgPromise(initOptions)

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  pgp.pg.defaults.ssl = {
    rejectUnauthorized: false
  }
}

const db = pgp(connectionString)

module.exports = { db, pgp }
