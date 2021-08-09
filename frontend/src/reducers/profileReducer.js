import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const profileReducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return action.data
    case 'LOGOUT_USER':
      return null
    default: return state
  }
}

export const initializeProfile = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN_USER',
        data: user
      })
    }
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      dispatch({
        type: 'LOGIN_USER',
        data: loggedUser
      })
      dispatch(setNotification('success', `logged in as ${loggedUser.name}`))
    }
    catch (exception) {
      dispatch(setNotification('error', exception.response.data.error))
    }
  }
}

export const logoutUser = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  return {
    type: 'LOGOUT_USER'
  }
}

export default profileReducer