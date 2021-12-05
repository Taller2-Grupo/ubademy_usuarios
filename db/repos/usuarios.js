const { usuarios: sql } = require('../sql')

class UsuariosRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  // Adds a new user, and returns the new object;
  async add (username, password, nombre, apellido, esAdmin) {
    return this.db.one(sql.add, [username, password, nombre, apellido, esAdmin])
  }

  // Tries to find a user from id;
  async findById (id) {
    return this.db.oneOrNone('SELECT * FROM usuarios WHERE id = $1', +id)
  }

  // Tries to find a user from name;
  async findByUsername (username) {
    return this.db.oneOrNone('SELECT * FROM usuarios WHERE username = $1', username)
  }

  // Returns all user records;
  async all () {
    return this.db.any('SELECT * FROM usuarios')
  }

  async update (username, nombre, apellido) {
    return this.db.one(sql.update, [username, nombre, apellido])
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
}

module.exports = UsuariosRepository
