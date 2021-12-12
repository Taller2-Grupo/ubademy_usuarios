const { validateEmail } = require('./utils')
const { apiKeyIsValid } = require('./auth')
const axios = require('axios')
const { TipoEvento, esTipoEvento } = require('./enums')

module.exports.setup = (app, db) => {
  /**
   * @openapi
   * /usuarios/add:
   *    post:
   *      description: Crea un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      requestBody:
   *          description: Usuario a crear
   *          required: true
   *          content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    required:
   *                        - username
   *                        - password
   *                        - nombre
   *                        - apellido
   *                        - esAdmin
   *                    properties:
   *                        username:
   *                            type: string
   *                        password:
   *                            type: string
   *                        nombre:
   *                            type: string
   *                        apellido:
   *                            type: string
   *                        esAdmin:
   *                            type: boolean
   *      responses:
   *          201:
   *              description: Devuelve el usuario creado
   */
  app.post('/usuarios/add', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const body = req.body

    if (!body.username || !body.password || !body.nombre || !body.apellido || typeof body.esAdmin === 'undefined') {
      return res.status(400).json({
        success: false,
        error: 'Body incompleto.'
      })
    }

    if (!validateEmail(body.username)) {
      return res.status(400).json({
        success: false,
        error: 'El username debe ser un mail.'
      })
    }

    const user = await db.usuarios.findByUsername(body.username)

    if (user != null) {
      return res.status(400).json({
        success: false,
        error: 'Username ya registrado.'
      })
    }

    try {
      const data = await db.usuarios.add(body.username, body.password, body.nombre, body.apellido, body.esAdmin)

      await registrarEvento(TipoEvento.USUARIO_CREADO)

      res.status(201).json({
        success: true,
        data
      })
    } catch (error) {
      internalError(res, error)
    }
  })

  /**
   * @openapi
   * /usuarios/{username}:
   *   get:
   *     description: Obtiene usuario por username
   *     parameters:
   *         - in: path
   *           name: username
   *           schema:
   *              type: string
   *           required: true
   *     responses:
   *       200:
   *         description: Devuelve el usuario encontrado
   */
  app.get('/usuarios/:username', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    try {
      const user = await db.usuarios.findByUsername(req.params.username)

      if (user === null) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado.'
        })
      }

      res.json({
        success: true,
        data: user
      })
    } catch (error) {
      res.json({
        success: false,
        error: error.message || error
      })
    }
  })

  /**
   * @openapi
   * /usuarios:
   *   get:
   *     description: Obtiene todos los usuarios
   *     responses:
   *       200:
   *         description: Devuelve todos los usuarios
   */
  GET('/usuarios', () => db.usuarios.all())

  /**
   * @openapi
   * /usuarios/update:
   *    patch:
   *      description: Actualiza un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      requestBody:
   *          description: Usuario a actualizar
   *          required: true
   *          content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    required:
   *                        - username
   *                        - nombre
   *                        - apellido
   *                    properties:
   *                        username:
   *                            type: string
   *                        nombre:
   *                            type: string
   *                        apellido:
   *                            type: string
   *      responses:
   *          200:
   *              description: Devuelve el usuario actualizado
   */
  app.patch('/usuarios/update', (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const body = req.body

    if (!body.username || !body.nombre || !body.apellido) {
      return res.status(400).json({
        success: false,
        error: 'Body incompleto.'
      })
    }

    db.usuarios.update(body.username, body.nombre, body.apellido)
      .then(function (usuarioActualizado) {
        res.json(usuarioActualizado)
      })
      .catch(function (error) {
        internalError(res, error)
      })
  })

  // Generic GET handler;
  function GET (url, handler) {
    app.get(url, async (req, res) => {
      const headerApiKey = req.get('X-API-KEY')

      if (!apiKeyIsValid(headerApiKey)) {
        return res.status(401).json({
          success: false,
          error: 'API Key invalida'
        })
      }

      try {
        const data = await handler(req)
        res.status(200).json({
          success: true,
          data
        })
      } catch (error) {
        internalError(res, error)
      }
    })
  }

  /**
   * @openapi
   * /usuarios/devices:
   *    post:
   *      description: Crea un device para un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      requestBody:
   *          description: Device a crear
   *          required: true
   *          content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    required:
   *                        - username
   *                        - device
   *                    properties:
   *                        username:
   *                            type: string
   *                        device:
   *                            type: string
   *      responses:
   *          201:
   *              description: Devuelve el device creado
   */
  app.post('/usuarios/devices', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const body = req.body

    if (!body.username || !body.device) {
      return res.status(400).json({
        success: false,
        error: 'Body incompleto.'
      })
    }

    try {
      const data = await db.usuarios.addDevice(body.username, body.device)
      res.status(201).json({
        success: true,
        data
      })
    } catch (error) {
      internalError(res, error)
    }
  })

  /**
   * @openapi
   * /usuarios/devices/{device}:
   *    delete:
   *      description: Elimina un device para un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      parameters:
   *         - in: path
   *           name: device
   *           schema:
   *              type: string
   *           required: true
   *      responses:
   *          201:
   *              description: Devuelve el device eliminado
   */
  app.delete('/usuarios/devices/:device', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    try {
      const deviceDB = await db.usuarios.getDevice(req.params.device)

      if (deviceDB === null) {
        return res.status(404).json({
          success: false,
          error: 'Device no encontrado.'
        })
      }

      const data = await db.usuarios.deleteDevice(req.params.device)
      res.status(202).json({
        success: true,
        data
      })
    } catch (error) {
      internalError(res, error)
    }
  })

  /**
   * @openapi
   * /usuarios/notify:
   *    post:
   *      description: Notifica los devices de un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      requestBody:
   *          description: Usuario a notificar
   *          required: true
   *          content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    required:
   *                        - username
   *                        - title
   *                        - body
   *                    properties:
   *                        username:
   *                            type: string
   *                        title:
   *                            type: string
   *                        body:
   *                            type: string
   *      responses:
   *          201:
   *              description: Notificó al usuario correctamente
   */
  app.post('/usuarios/notify', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    try {
      const devices = await db.usuarios.getDevicesFromUser(req.body.username)

      if (devices.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Devices no encontrados.'
        })
      }

      const devicesList = devices.map((d) => d.id)

      const notificador = require('node-gcm')
      const sender = notificador.Sender('AAAAzalzT_s:APA91bFtIbR8YlWZ61WG9i09D_pPz7dLUZThRykja_mp1CTqD6a6x' +
        'Rjp7O-PX4ThjgJQQDqkPX9gWw6NMsEvyop9Sf-bvmki7UXcixbLjGhRKLi8VuUv7Tckgq7d8GgUrySAd4L7oIU-')
      const message = new notificador.Message({ notification: { title: req.body.title, body: req.body.body }, data: {} })
      sender.send(message, { registrationTokens: devicesList }, function (err, response) {
        if (err) console.error(err)
        else console.log(response)
      })

      res.status(200).json({
        success: true,
        data: 'Todo ok'
      })
    } catch (error) {
      internalError(res, error)
    }
  })

  /**
   * @openapi
   * /usuarios/bloquear/{username}:
   *    patch:
   *      description: Bloquea un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      parameters:
   *          - in: path
   *            name: username
   *            schema:
   *               type: string
   *            required: true
   *      responses:
   *          200:
   *              description: Devuelve el usuario bloqueado
   */
  app.patch('/usuarios/bloquear/:username', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const user = await db.usuarios.findByUsername(req.params.username)

    if (user === null) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado.'
      })
    }

    db.usuarios.bloquear(req.params.username)
      .then(function (usuarioBloqueado) {
        registrarEvento(TipoEvento.USUARIO_BLOQUEADO)
        res.status(200).json(usuarioBloqueado)
      })
      .catch(function (error) {
        internalError(res, error)
      })
  })

  /**
   * @openapi
   * /usuarios/activar/{username}:
   *    patch:
   *      description: Activa un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      parameters:
   *          - in: path
   *            name: username
   *            schema:
   *               type: string
   *            required: true
   *      responses:
   *          200:
   *              description: Devuelve el usuario activado
   */
  app.patch('/usuarios/activar/:username', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const user = await db.usuarios.findByUsername(req.params.username)

    if (user === null) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado.'
      })
    }

    db.usuarios.activar(req.params.username)
      .then(function (usuarioActivado) {
        res.json(usuarioActivado)
      })
      .catch(function (error) {
        internalError(res, error)
      })
  })

  /**
   * @openapi
   * /usuarios/{username}/billetera:
   *    post:
   *      description: Crea una billetera a un usuario
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      parameters:
   *          - in: path
   *            name: username
   *            schema:
   *               type: string
   *            required: true
   *      responses:
   *          201:
   *              description: Devuelve la billetera creada
   */
  app.post('/usuarios/:username/billetera', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const user = await db.usuarios.findByUsername(req.params.username)

    if (user === null) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado.'
      })
    }

    const billeteraExistente = await db.usuarios.findBilleteraByUsername(req.params.username)

    if (billeteraExistente !== null) {
      return res.status(400).json({
        success: false,
        error: 'Billetera ya existe.'
      })
    }

    axios
      .post('https://ubademy-smart-contract.herokuapp.com/wallet', {})
      .then(async resp => {
        const billetera = await db.usuarios.addBilletera(req.params.username, resp.data.address, resp.data.privateKey)
        res.status(201).json(billetera)
      })
      .catch(error => {
        res.status(500).json(error)
      })
  })

  /**
   * @openapi
   * /usuarios/{username}/suscripcion/{tipoSuscripcion}:
   *    post:
   *      description: Suscribe al usuario a una suscripcion paga
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      parameters:
   *          - in: path
   *            name: username
   *            schema:
   *               type: string
   *            required: true
   *          - in: path
   *            name: tipoSuscripcion
   *            schema:
   *               type: string
   *            required: true
   *      responses:
   *          200:
   *              description: Devuelve el usuario actualizado
   */
  app.post('/usuarios/:username/suscripcion/:tipoSuscripcion', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    if (req.params.tipoSuscripcion !== 'premium' && req.params.tipoSuscripcion !== 'vip') {
      return res.status(400).json({
        success: false,
        error: 'El tipo de suscripción no es válido.'
      })
    }

    const user = await db.usuarios.findByUsername(req.params.username)

    if (user === null) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado.'
      })
    }

    if (user.tipo_suscripcion === 'vip') {
      return res.status(400).json({
        success: false,
        error: 'Usuario ya tiene la suscripción más alta.'
      })
    }

    if (user.tipo_suscripcion === 'premium' && req.params.tipoSuscripcion === 'premium') {
      return res.status(400).json({
        success: false,
        error: 'Usuario ya posee esa suscripción.'
      })
    }

    const billetera = await db.usuarios.findBilleteraByUsername(req.params.username)

    if (billetera === null) {
      return res.status(400).json({
        success: false,
        error: 'El usuario no tiene una billetera.'
      })
    }

    const amountInEthers = getAmountByTipoSuscripcion(req.params.tipoSuscripcion)

    axios
      .post('https://ubademy-smart-contract.herokuapp.com/deposit', {
        privateKey: billetera.private_key,
        amountInEthers: amountInEthers
      })
      .then(async resp => {
        const usuarioActualizado = await db.usuarios.updateTipoSuscripcion(req.params.username, req.params.tipoSuscripcion)
        res.status(200).json(usuarioActualizado)
      })
      .catch(error => {
        console.error(error)
        if (error.response !== null && error.response.data.code === 'INSUFFICIENT_FUNDS') {
          res.status(400).json({
            success: false,
            error: 'Fondos insuficientes en la billetera.'
          })
        } else {
          res.status(500).json({
            success: false,
            error: error
          })
        }
      })
  })

  /**
   * @openapi
   * /eventos/{tipoEvento}:
   *    post:
   *      description: Crea un evento del tipo indicado
   *      consumes:
   *          - application/json
   *      produces:
   *          - application/json
   *      parameters:
   *          - in: path
   *            name: tipoEvento
   *            schema:
   *               type: string
   *            required: true
   *      responses:
   *          201:
   *              description: Devuelve el evento creado
   */
  app.post('/eventos/:tipoEvento', async (req, res) => {
    const headerApiKey = req.get('X-API-KEY')

    if (!apiKeyIsValid(headerApiKey)) {
      return res.status(401).json({
        success: false,
        error: 'API Key invalida'
      })
    }

    const tipoEvento = req.params.tipoEvento

    if (!esTipoEvento(tipoEvento)) {
      return res.status(400).json({
        success: false,
        error: 'El tipo evento no es válido.'
      })
    }

    try {
      const data = await db.eventos.add(tipoEvento)
      res.status(201).json({
        success: true,
        data
      })
    } catch (error) {
      internalError(res, error)
    }
  })

  async function registrarEvento (tipoEvento) {
    try {
      const evento = await db.eventos.add(tipoEvento)
      registrarEventoDiario(evento)
      return evento
    } catch {
      console.log('Ocurrió un error registrando el evento ' + tipoEvento)
    }
  }

  async function registrarEventoDiario (evento) {
    try {
      const eventoDiario = await db.eventos.getEventoDiario(evento)

      if (eventoDiario === null) {
        await db.eventos.addEventoDiario(evento)
      }

      return db.eventos.increaseEventoDiario(evento)
    } catch {
      console.log('Ocurrió un error registrando el evento diario del evento con id ' + evento.id)
    }
  }
}

function getAmountByTipoSuscripcion (tipoSuscripcion) {
  if (tipoSuscripcion === 'premium') {
    return '0.0001'
  }

  if (tipoSuscripcion === 'vip') {
    return '0.0002'
  }

  return '0'
}

function internalError (res, error) {
  res.status(500).json({
    success: false,
    error: error.message || error
  })
}
