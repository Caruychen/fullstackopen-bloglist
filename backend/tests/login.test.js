const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const User = require('../models/user')

describe('when there is one user in the db', () => {
  const testUser = {
    username: 'root',
    password: 'sekret'
  }

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash(testUser.password, 10)
    const user = new User({ username: testUser.username, passwordHash })
    await user.save()
  })

  test('logging in with correct username and password succeeds', async () => {
    const result = await api
      .post('/api/login')
      .send(testUser)
      .expect(200)
      .expect('Content-type', /application\/json/)
    
    expect(result.body.token).toBeDefined()
    expect(result.body.username).toContain('root')
  })

  test('logging in without username fails with the correct status and error message', async () => {
    const missingUsername = {
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(missingUsername)
      .expect(401)
      .expect('Content-type', /application\/json/)
    
    expect(result.body.error).toContain('invalid username or password')
  })

  test('logging in with wrong username fails with the correct status and error message', async () => {
    const wrongUsername = {
      username: 'wrongname',
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(wrongUsername)
      .expect(401)
      .expect('Content-type', /application\/json/)
    
    expect(result.body.error).toContain('invalid username or password')
  })

  test('logging in with wrong password fails with the correct status and error message', async () => {
    const wrongPassword = {
      username: 'root',
      password: 'wrong'
    }

    const result = await api
      .post('/api/login')
      .send(wrongPassword)
      .expect(401)
      .expect('Content-type', /application\/json/)
    
    expect(result.body.error).toContain('invalid username or password')
  })
})

afterAll(() => {
  mongoose.connection.close()
})