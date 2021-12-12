require('dotenv').config()

const { describe } = require('jest-circus')
const supertest = require('supertest')
const { pgp } = require('../db')
const { app, server } = require('../index')
const axios = require('axios')
const { TipoEvento } = require('../enums')

const api = supertest(app)

jest.mock('axios')

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
  test('devuelve 404 cuando no existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .get('/usuarios/string')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(404)
  })

  test('devuelve 200 cuando existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .get('/usuarios/' + username)
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

  test('devuelve 201 con body completado correctamente.', async () => {
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

  test('devuelve 400 si ya existe user con el mismo username.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

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
      .expect(400)
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

describe('Patch a /usuarios/update', () => {
  test('devuelve 400 sin body.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .patch('/usuarios/update')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(400)
  })

  test('devuelve 200 con body completo.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .patch('/usuarios/update')
      .set('X-API-KEY', process.env.API_KEY)
      .send({
        username: username,
        nombre: 'test',
        apellido: 'test'
      })
      .expect(200)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .patch('/usuarios/update')
      .send({
        username: username,
        nombre: 'test',
        apellido: 'test'
      })
      .expect(401)
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

  test('devuelve 201 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .post('/usuarios/devices')
      .send({
        username: username,
        device: 'test_2'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
  })
})

describe('DELETE a /usuarios/devices/{device}', () => {
  test('devuelve 202 con device existente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()
    const device = await crearDevice(username)

    await api
      .delete('/usuarios/devices/' + device)
      .set('X-API-KEY', process.env.API_KEY)
      .expect(202)
  })

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

  test('devuelve 202 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false
    process.env.API_KEY = 'test'

    const username = await crearUsuario()
    const device = await crearDevice(username)

    await api
      .delete('/usuarios/devices/' + device)
      .expect(202)
  })
})

describe('Patch a /usuarios/bloquear/username', () => {
  test('devuelve 200 cuando existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .patch('/usuarios/bloquear/' + username)
      .set('X-API-KEY', process.env.API_KEY)
      .expect(200)
  })

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
  test('devuelve 200 cuando existe el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const username = await crearUsuario()

    await api
      .patch('/usuarios/activar/' + username)
      .set('X-API-KEY', process.env.API_KEY)
      .expect(200)
  })

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

describe('Post a /usuarios/{username}/billetera', () => {
  test('devuelve 201 con username existente sin billetera.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
  })

  test('devuelve 400 si ya existe billetera para el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
  })

  test('devuelve 201 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
  })

  test('devuelve 404 con username inexistente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + 'wwwwwwwwwww' + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
  })
})

describe('Post a /usuarios/{username}/suscripcion/{tipoSuscripcion}', () => {
  test('devuelve 200 caso feliz premium.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/premium')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('devuelve 200 caso feliz vip.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/vip')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('devuelve 400 si ya es vip.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/vip')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/premium')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
  })

  test('devuelve 400 si quiere suscribire a premium y ya es premium.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/premium')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/premium')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
  })

  test('devuelve 400 con tipo suscripcion inexistente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/suscripcionInexistente')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
  })

  test('devuelve 400 si no existe billetera para el usuario.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/premium')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    const newUsername = await crearUsuario()

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/premium')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
  })

  test('devuelve 200 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false

    const newUsername = await crearUsuario()

    axios.post.mockImplementation(() => Promise.resolve({
      data: {
        address: 'address.test',
        privateKey: 'privateKey.test'
      }
    }))

    await api
      .post('/usuarios/' + newUsername + '/billetera')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + newUsername + '/suscripcion/vip')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('devuelve 404 con usuario inexistente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    axios.post.mockImplementation(() => Promise.resolve())

    await api
      .post('/usuarios/' + 'wwwwwwwwwwwwww' + '/suscripcion/premium')
      .set('X-API-KEY', process.env.API_KEY)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
  })
})

describe('Post a /eventos/{tipoEvento}', () => {
  test('devuelve 400 con tipoEvento inexistente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/eventos/EVENTO_INEXISTENTE')
      .set('X-API-KEY', process.env.API_KEY)
      .expect(400)
  })

  test('devuelve 201 con tipoEvento existente.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/eventos/' + TipoEvento.LOGIN_GOOGLE)
      .set('X-API-KEY', process.env.API_KEY)
      .expect(201)
  })

  test('devuelve 401 sin api key.', async () => {
    process.env.API_KEY_ENABLED = true
    process.env.API_KEY = 'test'

    await api
      .post('/eventos/' + TipoEvento.LOGIN_GOOGLE)
      .expect(401)
  })

  test('devuelve 201 con api key desactivada.', async () => {
    process.env.API_KEY_ENABLED = false

    await api
      .post('/eventos/' + TipoEvento.LOGIN_GOOGLE)
      .expect(201)
  })

  describe('Get a /eventos', () => {
    test('devuelve 400 con tipoEvento inexistente.', async () => {
      process.env.API_KEY_ENABLED = true
      process.env.API_KEY = 'test'

      await api
        .get('/eventos/diarios?tipoEvento=EVENTO_INEXISTENTE')
        .set('X-API-KEY', process.env.API_KEY)
        .expect(400)
    })

    test('devuelve 400 con diasAtras negativo.', async () => {
      process.env.API_KEY_ENABLED = true
      process.env.API_KEY = 'test'

      await api
        .get('/eventos/diarios?diasAtras=-1')
        .set('X-API-KEY', process.env.API_KEY)
        .expect(400)
    })

    test('devuelve 200 con tipoEvento existente.', async () => {
      process.env.API_KEY_ENABLED = true
      process.env.API_KEY = 'test'

      await api
        .get('/eventos/diarios?tipoEvento=' + TipoEvento.USUARIO_CREADO)
        .set('X-API-KEY', process.env.API_KEY)
        .expect(200)
    })

    test('devuelve 200 sin query params.', async () => {
      process.env.API_KEY_ENABLED = true
      process.env.API_KEY = 'test'

      await api
        .get('/eventos/diarios')
        .set('X-API-KEY', process.env.API_KEY)
        .expect(200)
    })

    test('devuelve 401 sin api key.', async () => {
      process.env.API_KEY_ENABLED = true
      process.env.API_KEY = 'test'

      await api
        .get('/eventos/diarios')
        .expect(401)
    })

    test('devuelve 200 con api key desactivada.', async () => {
      process.env.API_KEY_ENABLED = false

      await api
        .get('/eventos/diarios')
        .expect(200)
    })
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

let deviceNumber = 0

async function crearDevice (username) {
  const deviceId = 'test_fixture_' + deviceNumber
  deviceNumber++

  await api
    .post('/usuarios/devices')
    .set('X-API-KEY', process.env.API_KEY)
    .send({
      username: username,
      device: deviceId
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  return deviceId
}
