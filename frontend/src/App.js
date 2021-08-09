import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Menu from './components/Menu'
import Blogs from './views/Blogs'
import Blog from './views/Blog'
import Users from './views/Users'
import User from './views/User'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogsReducer'
import { initializeProfile } from './reducers/profileReducer'
import { initializeUsers } from './reducers/usersReducer'
import {
  Switch, Route,
  useRouteMatch
} from 'react-router-dom'
// import './App.css'
import Container from '@material-ui/core/Container'

const App = () => {
  const profile = useSelector(state => state.profile)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeProfile())
    dispatch(initializeUsers())
  }, [dispatch])

  const finder = (data, match) => match ? data.find(item => item.id === match.params.id) : null
  const userMatch = useRouteMatch('/users/:id')
  const blogMatch = useRouteMatch('/blogs/:id')
  const user = finder(users, userMatch)
  const blog = finder(blogs, blogMatch)

  if (profile === null) return <LoginForm />
  return (
    <Container>
      <Menu name={profile.name} />
      <h2>blog app</h2>
      <Notification />
      <Switch>
        <Route path="/users/:id">
          <User user={user} />
        </Route>
        <Route path="/users">
          <Users users={users} />
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={blog} profileUsername={profile.username} />
        </Route>
        <Route path="/">
          <Blogs />
        </Route>
      </Switch>
    </Container>
  )
}

export default App