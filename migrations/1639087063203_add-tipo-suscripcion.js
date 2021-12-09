/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('usuarios', {
    tipo_suscripcion: {
      type: 'varchar(1000)',
      notNull: true,
      default: 'gratuita'
    }
  })
}

exports.down = pgm => {
  pgm.dropColumns('usuarios', ['tipo_suscripcion'])
}
