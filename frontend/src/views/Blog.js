import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import Comments from '../components/Comments'
import { updateBlog, deleteBlog } from '../reducers/blogsReducer'
import {
  Card,
  CardContent,
  Typography,
  Button
} from '@material-ui/core'

const Blog = ({ blog, profileUsername }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleUpdate = () => dispatch(updateBlog(blog))
  const handleDelete = () => {
    dispatch(deleteBlog(blog))
    history.push('/')
  }

  if (!blog) return null
  return (
    <div className="blog">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {blog.title}
          </Typography>
          <Typography variant="body2" component="a" href={blog.url} className="blogUrl">
            {blog.url}
          </Typography>
          <Typography variant="body2" component="p" className="blogLikes">
            {blog.likes} <Button variant="text" onClick={handleUpdate}>like</Button>
          </Typography>
          <Typography variant="body2" component="p" className="blogUser">
            added by {blog.user.name}
            {blog.user.username === profileUsername && <Button variant="text" onClick={handleDelete}>remove</Button>}
          </Typography>
        </CardContent>
      </Card>
      <Comments comments={blog.comments} />
    </div>
  )
}

export default Blog