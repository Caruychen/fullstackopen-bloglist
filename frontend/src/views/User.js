import React from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core'

const User = ({ user }) => {
  if (!user) return null
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><h3>{user.name}&apos;s blogs</h3></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.blogs.map(blog => {
            return (
              <TableRow key={blog.id}>
                <TableCell>{blog.title}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default User