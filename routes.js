const { validateEmail } = require('./utils')
const { apiKeyIsValid } = require('./auth')

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

    try {
      const data = await db.usuarios.add(body.username, body.password, body.nombre, body.apellido, body.esAdmin)
      res.json({
        success: true,
        data
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

    console.log(body)

    db.usuarios.update(body.username, body.nombre, body.apellido)
      .then(function (usuarioActualizado) {
        res.json(usuarioActualizado)
      })
      .catch(function (error) {
        res.json({
          success: false,
          error: error.message || error
        })
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
        res.json({
          success: true,
          data
        })
      } catch (error) {
        res.json({
          success: false,
          error: error.message || error
        })
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
      res.status(500).json({
        success: false,
        error: error.message || error
      })
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
      res.status(500).json({
        success: false,
        error: error.message || error
      })
    }
  })
}
