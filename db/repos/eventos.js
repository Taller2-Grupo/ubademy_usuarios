class EventosRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  async add (tipoEvento) {
    return this.db.one('INSERT INTO eventos("tipoEvento") VALUES($1) RETURNING *', [tipoEvento])
  }

  async addEventoDiario (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const fechaCreacionSinHora = new Date(anio, mes, dia)
    // const hora = fechaCreacion.getHours()

    return this.db.one('INSERT INTO eventos_diarios("tipoEvento", "fecha") VALUES($1, $2) RETURNING *', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async getEventoDiario (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const fechaCreacionSinHora = new Date(anio, mes, dia)
    // const hora = fechaCreacion.getHours()

    return this.db.oneOrNone('SELECT * FROM eventos_diarios WHERE "tipoEvento"=$1 AND "fecha"=$2', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async increaseEventoDiario (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const fechaCreacionSinHora = new Date(anio, mes, dia)
    // const hora = fechaCreacion.getHours()

    return this.db.one('UPDATE eventos_diarios SET "cantidad" = "cantidad" + 1 WHERE "tipoEvento"=$1 AND "fecha"=$2 RETURNING *', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async getEventosDiarios (tipoEvento, diasAtras) {
    const fechaDesde = new Date()
    fechaDesde.setDate(fechaDesde.getDate() - diasAtras)
    fechaDesde.setHours(0, 0, 0, 0)

    let query = 'SELECT * FROM eventos_diarios WHERE "fecha" >= $1'

    if (tipoEvento !== undefined) {
      query += ' AND "tipoEvento" = $2'
    }

    return this.db.manyOrNone(query, [fechaDesde, tipoEvento])
  }
}

module.exports = EventosRepository
