const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }
]

const newBlog = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5
}

const missingLikes = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
}

const missingTitleAndUrl = {
  author: 'Edsger W. Dijkstra',
  likes: 5
}

const initialComments = [
  {
    text: 'Wow! Great blog!'
  },
  {
    text: 'interesting...'
  },
  {
    text: 'hello world'
  }
]

const findInDb = async (model) => {
  const items = await model.find({})
  return items.map(item => item.toJSON())
}

const findOneInDb = async (model, id = {}) => {
  const item = await model.findOne(id)
  return item.toJSON()
}

const initializeUsers = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const usersArray = [
    new User({ username: 'root', passwordHash }),
    new User({ username: 'second', passwordHash })
  ]
  await usersArray[0].save()
  await usersArray[1].save()
}

const initializeBlogs = async () => {
  await Blog.deleteMany({})
  const user = await User.findOne({})
  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}

const initializeComments = async () => {
  await Comment.deleteMany({})
  const blog = await Blog.findOne({})
  const commentObjects = initialComments.map(comment => new Comment({ ...comment, blog: blog._id }))
  const promiseArray = commentObjects.map(comment => comment.save())
  await Promise.all(promiseArray)
}

const getToken = async () => {
  const user = await User.findOne({ username: 'root' })
  const userForToken = {
    username: user.username,
    id: user._id
  }
  return jwt.sign(userForToken, process.env.SECRET)
}

const getWrongToken = async () => {
  const user = await User.findOne({ username: 'second' })
  const userForToken = {
    username: user.username,
    id: user._id
  }
  return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = {
  initialBlogs,
  initialComments,
  newBlog,
  missingLikes,
  missingTitleAndUrl,
  findInDb,
  findOneInDb,
  initializeUsers,
  initializeBlogs,
  initializeComments,
  getToken,
  getWrongToken
}