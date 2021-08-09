import React, { useRef } from 'react'
import BlogList from '../components/BlogList'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'

const Blogs = () => {
  const blogFormRef = useRef()
  return (
    <div>
      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <BlogForm handleToggle={() => blogFormRef.current.toggleVisibility()} />
      </Togglable>
      <BlogList />
    </div>
  )
}

export default Blogs