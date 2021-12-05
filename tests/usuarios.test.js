require('dotenv').config()

const { describe } = require('jest-circus')
const supertest = require('supertest')
const { pgp } = require('../db')
const { app, server } = require('../index')

const api = supertest(app)

describe('Get a /usuarios', () => {
  it('devuelve 200 siempre.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(200)
  })

  test('devuelve 401 sin Api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios')
      .expect(401)
  })

  test('devuelve 200 con Api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios')
      .expect(200)
  })
})

describe('Get a /usuarios/username', () => {
  test('devuelve 200 cuando no existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(404)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .expect(401)
  })

  test('devuelve 404 con api key desactivada cuando no existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .expect(404)
  })
})

describe('Post a /usuarios/add', () => {
  test('devuelve 400 sin body.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(400)
  })

  test('devuelve 400 si el username no es un mail.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .set('X-API-KEY', process.env.API_KEY)
      .send({
        username: 'test',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .expect(400)
  })

  test('devuelve 200 con body completado correctamente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .set('X-API-KEY', process.env.API_KEY)
      .send({
        username: 'test_1@test.com',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .send({
        username: 'test_2@test.com',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
  })

  test('devuelve 201 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .send({
        username: 'test_3@test.com',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
  })
})

describe('Post a /usuarios/devices', () => {
  test('devuelve 400 sin body.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/devices')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(400)
  })

  test('devuelve 201 con body completado correctamente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .post('/usuarios/devices')
      .set('X-API-KEY', process.env.API_KEY)
      .send({
        username: username,
        device: 'test'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/devices')
      .send({
        username: 'test@test.com',
        device: 'test'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
  })

  // test('devuelve 201 con api key desactivada.', async () => {
  //   process.env.API_KEY_ENABLED = false
  //   process.env.API_KEY = 'test'

  //   await api
  //     .post('/usuarios/devices')
  //     .send({
  //       username: 'test@test.com',
  //       device: 'test'
  //     })
  //     .set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json')
  //     .expect(201)
  // })
})

describe('DELETE a /usuarios/devices/{device}', () => {
  // test('devuelve 202 con device existente.', async () => {
  //   process.env.API_KEY_ENABLED = true
  //   process.env.API_KEY = 'test'

  //   await api
  //     .delete('/usuarios/devices/asd')
  //     .set('X-API-KEY', process.env.API_KEY)
  //     .expect(202)
  // })

  test('devuelve 404 con device inexistente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .delete('/usuarios/devices/asd')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(404)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .delete('/usuarios/devices/asd')
      .expect(401)
  })

  // test('devuelve 202 con api key desactivada.', async () => {
  //   process.env.API_KEY_ENABLED = false
  //   process.env.API_KEY = 'test'

  //   await api
  //     .delete('/usuarios/devices/asd')
  //     .expect(202)
  // })
})

describe('Patch a /usuarios/bloquear/username', () => {
  test('devuelve 404 cuando no existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .patch('/usuarios/bloquear/string')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(404)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .patch('/usuarios/bloquear/string')
      .expect(401)
  })

  test('devuelve 404 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/bloquear/string')
      .expect(404)
  })
})

describe('Patch a /usuarios/activar/username', () => {
  test('devuelve 404 cuando no existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .patch('/usuarios/activar/string')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(404)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .patch('/usuarios/activar/string')
      .expect(401)
  })

  test('devuelve 404 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/activar/string')
      .expect(404)
  })
})

afterAll(() => {
  server.close()
  pgp.end()
})

let userNumber = 0

async function crearUsuario () {
  const username = 'test_fixture_' + userNumber + '@test.com'
  userNumber++

  await api
    .post('/usuarios/add')
    .set('X-API-KEY', process.env.API_KEY)
    .send({
      username: username,
      password: 'test',
      nombre: 'test',
      apellido: 'test',
      esAdmin: false
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  return username
}
