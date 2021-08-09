import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector(state => {
    return [...state.blogs].sort((blog1, blog2) => blog2.likes - blog1.likes)
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {blogs.map(blog => {
            return (
              <TableRow key={blog.id} className="blogItem">
                <TableCell>
                  <Link to={`/blogs/${blog.id}`} className="blogLink">{blog.title}</Link>
                </TableCell>
                <TableCell>
                  by {blog.author}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList