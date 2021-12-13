/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('eventos_diarios', {
    id: 'id',
    tipoEvento: {
      type: 'varchar(1000)',
      notNull: true
    },
    fecha: {
      type: 'timestamp',
      notNull: true
    },
    cantidad: {
      type: 'int',
      notNull: true,
      default: 0
    }
  })
  pgm.createIndex('eventos_diarios', ['tipoEvento', 'fecha'], {
    unique: true
  })
}

exports.down = pgm => {
  pgm.dropTable('eventos_diarios')
}
