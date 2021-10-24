const {db} = require('./db');

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
     *                    properties:
     *                        username:
     *                            type: string
     *      responses:
     *          201:
     *              description: Devuelve el usuario creado
     */
    app.post('/usuarios/add', (req, res) => {
        body = req.body;

        console.log(body)

        // db.users.add()
        //     .then(function (data) {
        //     res.send('DATA:' + data.value)        
        //     })
        //     .catch(function (error) {
        //     console.log('ERROR:', error)
        //     })    
    })

    /**
     * @openapi
     * /usuarios/:username:
     *   get:
     *     description: Obtiene usuario por username
     *     responses:
     *       200:
     *         description: Devuelve el usuario encontrado
     */
    GET('/usuarios/:username', req => db.users.findByUsername(req.params.username))

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

    // Generic GET handler;
    function GET(url, handler) {
        app.get(url, async (req, res) => {
            try {
                const data = await handler(req);
                res.json({
                    success: true,
                    data
                });
            } catch (error) {
                res.json({
                    success: false,
                    error: error.message || error
                });
            }
        });
    }
}