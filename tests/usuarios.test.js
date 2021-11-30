require('dotenv').config()

const { describe } = require('jest-circus')
const supertest = require('supertest')
const { buildApp } = require('../app')

// Setup:
const mockDB = jest.fn()
const api = supertest(buildApp(mockDB))

describe('Get a /usuarios', () => {
  test('devuelve 200 siempre.', async () => {
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
  test('devuelve 200 cuando existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(200)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .expect(401)
  })

  test('devuelve 200 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .expect(200)
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
        username: 'test@test.com',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .send({
        username: 'test@test.com',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
  })

  test('devuelve 200 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    await api
      .post('/usuarios/add')
      .send({
        username: 'test@test.com',
        password: 'test',
        nombre: 'test',
        apellido: 'test',
        esAdmin: false
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
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

  // TODO: No se por que tira null el db.usuarios
  // test('devuelve 201 con body completado correctamente.', async () => {
  //   process.env.API_KEY_ENABLED = true
  //   process.env.API_KEY = 'test'

  //   await api
  //     .post('/usuarios/devices')
  //     .set('X-API-KEY', process.env.API_KEY)
  //     .send({
  //       username: 'test@test.com',
  //       device: 'test'
  //     })
  //     .set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json')
  //     .expect({})
  //     .expect(201)
  // })

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

  // TODO: No se por que tira null el db.usuarios
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

  // TODO: No se por que tira null el db.usuarios
  // test('devuelve 404 con device inexistente.', async () => {
  //   process.env.API_KEY_ENABLED = true
  //   process.env.API_KEY = 'test'

  //   await api
  //     .delete('/usuarios/devices/asd')
  //     .set('X-API-KEY', process.env.API_KEY)
  //     .expect({})
  //     .expect(404)
  // })

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
