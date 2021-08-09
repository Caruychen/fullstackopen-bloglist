import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS': {
      return action.data
    }
    case 'NEW_BLOG': {
      return [...state, action.data]
    }
    case 'UPDATE_BLOG': {
      const updatedBlog = action.data
      return state.map(blog => blog.id === updatedBlog.id ? { ...blog, likes: updatedBlog.likes } : blog)
    }
    case 'UPDATE_COMMENTS': {
      const comment = action.data
      return state.map(blog => blog.id === comment.blog ? { ...blog, comments: blog.comments.concat(comment) } : blog)
    }
    case 'DELETE_BLOG': {
      const blogToDelete = action.data
      return state.filter(blog => blog.id !== blogToDelete.id)
    }
    default: return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
      dispatch(setNotification('success', `a new blog ${blog.title} by ${blog.author} added`))
    }
    catch (exception) {
      dispatch(setNotification('error', exception.response.data.error))
    }
  }
}

export const updateBlog = (blog) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })
      dispatch({
        type: 'UPDATE_BLOG',
        data: updatedBlog
      })
    }
    catch (exception) {
      dispatch(setNotification('error', exception.response.data.error))
    }
  }
}

export const addComment = (comment, blogID) => {
  return async dispatch => {
    try {
      const savedComment = await blogService.postComment(comment, blogID)
      dispatch({
        type: 'UPDATE_COMMENTS',
        data: savedComment
      })
    }
    catch (exception) {
      dispatch(setNotification('error', exception.response.data.error))
    }
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    try {
      await blogService.remove(blog)
      dispatch({
        type: 'DELETE_BLOG',
        data: blog
      })
      dispatch(setNotification('success', `Removed blog ${blog.title} by ${blog.author}`))
    }
    catch (exception) {
      dispatch(setNotification('error', exception.response.data.error))
    }
  }
}

export default blogReducer