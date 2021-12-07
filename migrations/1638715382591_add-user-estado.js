/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('usuarios', {
    estado: {
      type: 'varchar(1000)',
      notNull: true,
      default: 'activo'
    }
  })
}

exports.down = pgm => {
  pgm.dropColumns('usuarios', ['estado'])
}
