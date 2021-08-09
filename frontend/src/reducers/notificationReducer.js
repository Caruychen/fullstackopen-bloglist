let _notificationTimeout

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.data
    case 'HIDE_NOTIFICATION':
      return null
    default: return state
  }
}

export const showNotification = (message) => {
  return {
    type: 'SHOW_NOTIFICATION',
    data: message
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION'
  }
}

export const setNotification = (status, text) => {
  return dispatch => {
    clearTimeout(_notificationTimeout)
    dispatch(showNotification({ status, text }))
    _notificationTimeout = setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
  }
}

export default notificationReducer