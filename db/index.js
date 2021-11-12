// const promise = require('bluebird'); // best promise library today
const promise = require('bluebird') // best promise library today
const pgPromise = require('pg-promise') // pg-promise core library
const { Usuarios } = require('./repos')

// pg-promise initialization options:
const initOptions = {

  // Use a custom promise library, instead of the default ES6 Promise:
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

// Initializing the library:
const pgp = pgPromise(initOptions)

pgp.pg.defaults.ssl = {
  rejectUnauthorized: false
}

// Creating the database instance:
// const db = pgp('postgresql://postgres:postgres@localhost/postgres');
const db = pgp('postgres://lfnthgmtoghotx:4733d9c66bf50864c899e412deb8b9b16167b899dd194f26b6653798d50d6c16@ec2-3-209-65-193.compute-1.amazonaws.com:5432/d5af894db3sfi0')

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
module.exports = { db, pgp }
