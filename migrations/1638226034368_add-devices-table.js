/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('devices', {
    id: {
      type: 'varchar(1000)',
      notNull: true,
      primaryKey: true
    },
    username: {
      type: 'varchar(1000)',
      notNull: true,
      references: 'usuarios(username)'
    },
    fechaCreacion: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    fechaActualizacion: {
      type: 'timestamp'
    }
  })
  pgm.createIndex('devices', 'username', {
    unique: true
  })
}

exports.down = pgm => {
  pgm.dropTable('devices')
}
