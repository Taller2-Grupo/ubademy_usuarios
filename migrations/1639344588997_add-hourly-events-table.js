/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('eventos_por_hora', {
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
  pgm.createIndex('eventos_por_hora', ['tipoEvento', 'fecha'], {
    unique: true
  })
}

exports.down = pgm => {
  pgm.dropTable('eventos_por_hora')
}
