import React, { useState } from 'react'
import Notification from './Notification'
import FormInput from './FormInput'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/profileReducer'
import { Button } from '@material-ui/core'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <FormInput value={username} text='username' type='text' onChange={setUsername} />
        <FormInput value={password} text='password' type='password' onChange={setPassword} />
        <Button variant="contained" color="primary" id="login-button" type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginForm