const { db } = require('./db')

module.exports.setup = (app) => {
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
  app.post('/usuarios/add', (req, res) => {
    const body = req.body

    console.log(body)

    db.usuarios.add(body.username, body.password, body.nombre, body.apellido, body.esAdmin)
      .then(function (nuevoUsuario) {
        res.json(nuevoUsuario)
      })
      .catch(function (error) {
        res.json({
          success: false,
          error: error.message || error
        })
      })
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
  GET('/usuarios/:username', req => db.usuarios.findByUsername(req.params.username))

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
