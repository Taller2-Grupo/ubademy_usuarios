/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('usuarios', {
        id: 'id',
        username: {
            type: 'varchar(1000)',
            notNull: true
        },
        password: {
            type: 'varchar(1000)',
            notNull: true
        },
        nombre: {
            type: 'varchar(1000)',
            notNull: true
        },
        apellido: {
            type: 'varchar(1000)',
            notNull: true
        },
        esAdmin: {
            type: 'bool',
            notNull: true,
            default: 'false'
        },
        fechaCreacion: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        fechaActualizacion: {
            type: 'timestamp'            
        }
      })
    pgm.createIndex('usuarios', 'username', {
        unique: true
    })
};

exports.down = pgm => {
    pgm.dropTable('usuarios')
};
