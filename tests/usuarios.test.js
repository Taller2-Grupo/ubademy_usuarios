const { describe } = require('jest-circus')
const supertest = require('supertest')
const { buildApp } = require('../app')

// Setup:
const db = jest.fn()
const api = supertest(buildApp(db))

describe('Get a /usuarios', () => {
  test('devuelve 200 siempre.', async () => {
    await api
      .get('/usuarios')
      .expect(200)
  })
})

describe('Post a /usuarios/add', () => {
  test('devuelve 400 sin body.', async () => {
    await api
      .post('/usuarios/add')
      .expect(400)
  })

  test('devuelve 400 si el username no es un mail.', async () => {
    await api
      .post('/usuarios/add')
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
