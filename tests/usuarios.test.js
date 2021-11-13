const supertest = require('supertest')
const { app, server } = require('../index')
const { pgp } = require('../db/index')

const api = supertest(app)

test('GET a /usuarios devuelve 200 siempre.', async () => {
  await api
    .get('/usuarios')
    .expect(200)
})

afterAll(() => {
  server.close()
  pgp.end()
})
