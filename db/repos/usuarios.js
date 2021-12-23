const { usuarios: sql } = require('../sql')

class UsuariosRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  async add (username, password, nombre, apellido, esAdmin) {
    return this.db.one(sql.add, [username, password, nombre, apellido, esAdmin])
  }

  // Tries to find a user from id;
  // async findById (id) {
  //   return this.db.oneOrNone('SELECT * FROM usuarios WHERE id = $1', +id)
  // }

  async findByUsername (username) {
    return this.db.oneOrNone('SELECT * FROM usuarios WHERE username = $1', username)
  }

  async all () {
    return this.db.any('SELECT * FROM usuarios')
  }

  async getByFilter (queryParams) {
    const filtroEstado = queryParams.estado
    const filtroNombre = queryParams.nombre
    const filtroApellido = queryParams.apellido
    let sqlQuery = 'SELECT * FROM usuarios WHERE 1=1'

    if (filtroEstado) {
      sqlQuery += ' AND estado = $1'
    }

    if (filtroNombre) {
      sqlQuery += ' AND "nombre" LIKE $2'
    }

    if (filtroApellido) {
      sqlQuery += ' AND apellido LIKE $3'
    }

    return this.db.any(sqlQuery, [filtroEstado, '%' + filtroNombre + '%', '%' + filtroApellido + '%'])
  }

  async update (username, nombre, apellido) {
    return this.db.one(sql.update, [username, nombre, apellido])
  }

  async updateUbicacion (username, latitud, longitud) {
    return this.db.one('UPDATE usuarios SET "latitud" = $2, "longitud" = $3 WHERE "username" = $1 RETURNING *', [username, latitud, longitud])
  }

  async addDevice (username, device) {
    return this.db.one(sql.add_device, [username, device])
  }

  async deleteDevice (device) {
    return this.db.oneOrNone('DELETE FROM devices WHERE id = $1', device)
  }

  async getDevice (device) {
    return this.db.oneOrNone('SELECT * FROM "devices" WHERE "id" = $1', device)
  }

  async getDevicesFromUser (username) {
    return this.db.manyOrNone('SELECT "id" FROM "devices" WHERE "username" = $1', username)
  }

  async bloquear (username) {
    return this.db.oneOrNone('UPDATE usuarios SET "estado" = $2 WHERE "username" = $1 RETURNING *', [username, 'bloqueado'])
  }

  async activar (username) {
    return this.db.oneOrNone('UPDATE usuarios SET "estado" = $2 WHERE "username" = $1 RETURNING *', [username, 'activo'])
  }

  async findBilleteraByUsername (username) {
    return this.db.oneOrNone('SELECT * FROM billeteras WHERE username = $1', username)
  }

  async addBilletera (username, address, privateKey) {
    return this.db.one('INSERT INTO billeteras("username", "address", "private_key") VALUES($1, $2, $3) RETURNING *', [username, address, privateKey])
  }

  async updateTipoSuscripcion (username, tipoSuscripcion) {
    return this.db.one('UPDATE usuarios SET tipo_suscripcion=$2, "fechaActualizacion" = current_date WHERE username=$1 RETURNING *', [username, tipoSuscripcion])
  }
}

module.exports = UsuariosRepository
