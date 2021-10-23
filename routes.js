const {db} = require('./db');

module.exports.setup = (app) => {
    /**
     * @openapi
     * /:
     *   get:
     *     description: Prueba temporaria de base de datos
     *     responses:
     *       200:
     *         description: Devuelve DATA 123
     */
    app.get('/', (req, res) => {
        var pgp = require('pg-promise')(/* options */)
        var db = pgp('postgresql://postgres:postgres@localhost/postgres')
        
        db.one('SELECT $1 AS value', 123)
        .then(function (data) {
            res.send('DATA:' + data.value)        
        })
        .catch(function (error) {
            console.log('ERROR:', error)
        })    
    })

    app.get('/usuario/:username', (req, res) => {
        var pgp = require('pg-promise')(/* options */)
        var db = pgp('postgresql://postgres:postgres@localhost/postgres')
        
        db.one('SELECT * FROM usuarios WHERE username == $1', req.params.username)
          .then(function (data) {
            res.send('DATA:' + data.value)        
          })
          .catch(function (error) {
            console.log('ERROR:', error)
          })    
      })
      
    app.post('/usuario', (req, res) => {
    var pgp = require('pg-promise')(/* options */)
    var db = pgp('postgresql://postgres:postgres@localhost/postgres')
    
    db.one('SELECT * FROM usuarios WHERE username == $1', req.params.username)
        .then(function (data) {
        res.send('DATA:' + data.value)        
        })
        .catch(function (error) {
        console.log('ERROR:', error)
        })    
    })

    GET('/usuarios', () => db.usuarios.total())

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