const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await helper.initializeUsers()
  await helper.initializeBlogs()
})

describe('retrieving blogs', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returned blog identifiers are named id, not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a new blog', () => {
  test('increases the number of blogs by one, and saves content correctly', async () => {
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const response = await helper.findInDb(Blog)
    const contents = response.map(blog => {
      const { title, author, url, likes } = blog
      return { title, author, url, likes }
    })
    const { title, author, url, likes } = helper.newBlog

    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContainEqual({ title, author, url, likes })
  })

  test('missing likes defaults the value to 0', async () => {
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .send(helper.missingLikes)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const response = await helper.findInDb(Blog)
    const savedBlog = response.find(blog => {
      return blog.title === helper.missingLikes.title
    })

    expect(savedBlog).toHaveProperty('likes', 0)
  })

  test('missing title and url gets a 400 response', async () => {
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .send(helper.missingTitleAndUrl)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })

  test('with a malformed token gets a 401 response with appropriate error message', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .set('Authorization', `bearer wrongToken`)
      .expect(401)
      .expect('Content-type', /application\/json/)

    const savedBlogs = await helper.findInDb(Blog)
    expect(response.body.error).toEqual('invalid token')
    expect(savedBlogs).toHaveLength(helper.initialBlogs.length)
  })

  test('without a token gets a 401 response with appropriate error message', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(401)
      .expect('Content-type', /application\/json/)

    const savedBlogs = await helper.findInDb(Blog)
    expect(response.body.error).toEqual('invalid token')
    expect(savedBlogs).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting a blog', () => {
  test('succeeds with a status of 204 if the id and token are valid', async () => {
    const blogsAtStart = await helper.findInDb(Blog)
    const blogToDelete = blogsAtStart[0]
    const token = await helper.getToken()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.findInDb(Blog)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('with an incorrect token gets a 401 response with appropriate error message', async () => {
    const blogsAtStart = await helper.findInDb(Blog)
    const blogToDelete = blogsAtStart[0]
    const token = await helper.getWrongToken()

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401)

    expect(response.body.error).toEqual('Unauthorized: incorrect token')

    const blogsAtEnd = await helper.findInDb(Blog)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(blogToDelete.title)
  })

  test('with a malformed token gets a 401 response with appropriate error message', async () => {
    const blogsAtStart = await helper.findInDb(Blog)
    const blogToDelete = blogsAtStart[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer wrongToken`)
      .expect(401)

    expect(response.body.error).toEqual('invalid token')

    const blogsAtEnd = await helper.findInDb(Blog)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(blogToDelete.title)
  })

  test('without a token gets a 401 response with appropriate error message', async () => {
    const blogsAtStart = await helper.findInDb(Blog)
    const blogToDelete = blogsAtStart[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer wrongToken`)
      .expect(401)

    expect(response.body.error).toEqual('invalid token')

    const blogsAtEnd = await helper.findInDb(Blog)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(blogToDelete.title)
  })
})

describe('updating a blog likes', () => {
  test('succeeds with a valid id, and returns updated data', async () => {
    const blogsAtStart = await helper.findInDb(Blog)
    const blogToUpdate = blogsAtStart[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ blogToUpdate, likes: blogToUpdate.likes + 1 })
      .expect(200)

    expect(response.body.likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})