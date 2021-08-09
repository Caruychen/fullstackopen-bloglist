const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return favorite.likes > blog.likes
      ? favorite
      : { title: blog.title, author: blog.author, likes: blog.likes }
  }

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer)
}

const mostBlogs = blogs => {
  if (blogs.length === 0) return null

  const authorMostBlogs = _.chain(blogs)
    .map('author')
    .countBy()
    .toPairs()
    .maxBy(_.last)
    .value()

  return { author: authorMostBlogs[0], blogs: authorMostBlogs[1] }
}

const mostLikes = blogs => {
  if (blogs.length === 0) return null
  
  const reducer = (likeCounts, blog) => {
    likeCounts[blog.author] = likeCounts[blog.author] + blog.likes || blog.likes
    return likeCounts
  }
  const authorMostLikes = _.chain(_.reduce(blogs, reducer, {}))
    .toPairs()
    .maxBy(_.last)
    .value()

  return { author: authorMostLikes[0], likes: authorMostLikes[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}