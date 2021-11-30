/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.dropIndex('devices', 'username', {
    unique: true
  })
}

exports.down = pgm => {
  pgm.createIndex('devices', 'username', {
    unique: true
  })
}
