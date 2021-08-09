const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await helper.initializeUsers()
  })

  test('creating user succeeds with new username', async () => {
    const usersAtStart = await helper.findInDb(User)
    const newUser = {
      username: 'caruyc',
      name: 'Caruy Chen',
      password: 'theansweris42',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const usersAtEnd = await helper.findInDb(User)
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creating user with an existing username fails with proper status code and message', async () => {
    const usersAtStart = await helper.findInDb(User)
    const newUser = {
      username: 'root',
      name: 'Testuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.findInDb(User)
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creating user without a username fails with proper status code and message', async () => {
    const usersAtStart = await helper.findInDb(User)
    const newUser = {
      name: 'Testuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')
    const usersAtEnd = await helper.findInDb(User)
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creating user without a password fails with proper status code and message', async () => {
    const usersAtStart = await helper.findInDb(User)
    const newUser = {
      username: 'tester',
      name: 'Testuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    expect(result.body.error).toContain('`password` is missing or too short')

    const usersAtEnd = await helper.findInDb(User)
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creating user with username less than 3 chars fails with proper status code and message', async () => {
    const usersAtStart = await helper.findInDb(User)
    const newUser = {
      username: 'ab',
      name: 'Testuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum')
    
    const usersAtEnd = await helper.findInDb(User)
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creating user with password less than 3 chars fails with proper status code and message', async () => {
    const usersAtStart = await helper.findInDb(User)
    const newUser = {
      username: 'tester',
      name: 'Testuser',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    expect(result.body.error).toContain('`password` is missing or too short')
    
    const usersAtEnd = await helper.findInDb(User)
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})