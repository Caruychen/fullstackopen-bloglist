const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Comment = require('../models/comment')
const Blog = require('../models/blog')

beforeEach(async () => {
  await helper.initializeUsers()
  await helper.initializeBlogs()
  await helper.initializeComments()
})


describe('retrieving comments', () => {
  test('all comments are returned', async () => {
    const response = await api.get('/api/comments')
    expect(response.body).toHaveLength(helper.initialComments.length)
  })

  test('returned comments are identified by id not _id', async () => {
    const response = await api.get('/api/comments')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a comment to a blog', () => {
  test('increases the number of comments for the blog by one, and saves content correctly', async () => {
    const blog = await helper.findOneInDb(Blog)
    const newComment = { text: 'a new comment' }
    await api
      .post(`/api/blogs/${blog.id}/comments`)
      .send(newComment)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const updatedBlog = await Blog.findById(blog.id)
    expect(updatedBlog.comments).toHaveLength(blog.comments.length + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})