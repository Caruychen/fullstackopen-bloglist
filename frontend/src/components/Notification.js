import React from 'react'
import { useSelector } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const message = useSelector(state => state.notification)
  return (
    <Snackbar open={message !== null} autoHideDuration={5000}>
      {
        message &&
        <Alert severity={message.status}>
          {message.text}
        </Alert>
      }
    </Snackbar>
  )
}

export default Notification