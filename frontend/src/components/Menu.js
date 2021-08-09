import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/profileReducer'
import {
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@material-ui/core'

const Menu = ({ name }) => {
  const dispatch = useDispatch()

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/blogs">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {name} logged in
        <Button color="inherit" onClick={() => dispatch(logoutUser())}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu