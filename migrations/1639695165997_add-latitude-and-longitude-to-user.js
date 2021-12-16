/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('usuarios', {
    latitud: {
      type: 'decimal',
      notNull: false
    }
  })

  pgm.addColumn('usuarios', {
    longitud: {
      type: 'decimal',
      notNull: false
    }
  })
}

exports.down = pgm => {
  pgm.dropColumns('usuarios', ['latitud', 'longitud'])
}
