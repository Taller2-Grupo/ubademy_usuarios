/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('eventos', {
    id: 'id',
    tipoEvento: {
      type: 'varchar(1000)',
      notNull: true
    },
    fechaCreacion: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('eventos')
}
