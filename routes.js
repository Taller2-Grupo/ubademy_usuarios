const { validateEmail } = require('./utils')

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
}
