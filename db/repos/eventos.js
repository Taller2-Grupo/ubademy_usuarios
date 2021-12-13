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

    return this.db.one('INSERT INTO eventos_diarios("tipoEvento", "fecha") VALUES($1, $2) RETURNING *', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async getEventoDiario (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const fechaCreacionSinHora = new Date(anio, mes, dia)

    return this.db.oneOrNone('SELECT * FROM eventos_diarios WHERE "tipoEvento"=$1 AND "fecha"=$2', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async increaseEventoDiario (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const fechaCreacionSinHora = new Date(anio, mes, dia)

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

  async addEventoPorHora (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const hora = fechaCreacion.getHours()
    const fechaCreacionSinHora = new Date(anio, mes, dia, hora)

    return this.db.one('INSERT INTO eventos_por_hora("tipoEvento", "fecha") VALUES($1, $2) RETURNING *', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async getEventoPorHora (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const hora = fechaCreacion.getHours()
    const fechaCreacionSinHora = new Date(anio, mes, dia, hora)

    return this.db.oneOrNone('SELECT * FROM eventos_por_hora WHERE "tipoEvento"=$1 AND "fecha"=$2', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async increaseEventoPorHora (evento) {
    const fechaCreacion = evento.fechaCreacion
    const dia = fechaCreacion.getDate()
    const mes = fechaCreacion.getMonth()
    const anio = fechaCreacion.getFullYear()
    const hora = fechaCreacion.getHours()
    const fechaCreacionSinHora = new Date(anio, mes, dia, hora)

    return this.db.one('UPDATE eventos_por_hora SET "cantidad" = "cantidad" + 1 WHERE "tipoEvento"=$1 AND "fecha"=$2 RETURNING *', [evento.tipoEvento, fechaCreacionSinHora])
  }

  async getEventosPorHora (tipoEvento, horasAtras) {
    const fechaDesde = new Date()
    fechaDesde.setHours(fechaDesde.getHours() - horasAtras, 0, 0, 0)

    console.log('Buscando desde ' + fechaDesde.toISOString())

    let query = 'SELECT * FROM eventos_por_hora WHERE "fecha" >= $1'

    if (tipoEvento !== undefined) {
      query += ' AND "tipoEvento" = $2'
    }

    return this.db.manyOrNone(query, [fechaDesde.toISOString(), tipoEvento])
  }
}

module.exports = EventosRepository
