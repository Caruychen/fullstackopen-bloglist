import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouteMatch } from 'react-router'
import { addComment } from '../reducers/blogsReducer'
import {
  TextField,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core'

const Comments = ({ comments }) => {
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const blogID = useRouteMatch('/blogs/:id').params.id

  const handleComment = event => {
    event.preventDefault()
    dispatch(addComment(comment, blogID))
    setComment('')
  }

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <TextField
          id='comment-input'
          type='text'
          value={comment}
          name='comment'
          onChange={({ target }) => setComment(target.value)}
        ></TextField>
        <Button id="add-comment-button" type='submit'>add comment</Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {comments.map(comment => {
              return (
                <TableRow key={comment.id}>
                  <TableCell>
                    {comment.text}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Comments