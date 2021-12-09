/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('billeteras', {
    id: 'id',
    username: {
      type: 'varchar(1000)',
      notNull: true,
      references: 'usuarios(username)',
      unique: true
    },
    private_key: {
      type: 'varchar(1000)',
      notNull: true
    },
    address: {
      type: 'varchar(1000)',
      notNull: true
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
}

exports.down = pgm => {
  pgm.dropTable('billeteras')
}
