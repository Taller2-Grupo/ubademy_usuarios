class EventosRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  async add (tipoEvento) {
    return this.db.one('INSERT INTO eventos("tipoEvento") VALUES($1) RETURNING *', [tipoEvento])
  }
}

module.exports = EventosRepository
