import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, cleanup } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let blog
  let mockUpdate
  let mockDelete
  const username = 'caruychen'

  beforeEach(() => {
    blog = {
      title: 'Test title',
      author: 'John Smith',
      url: 'http://www.testurl.com',
      likes: 0,
      user: {
        username: 'caruychen',
        name: 'Caruy',
      }
    }
    mockUpdate = jest.fn().mockName('mockUpdate')
    mockDelete = jest.fn().mockName('mockDelete')
    component = render(<Blog blog={blog} handleUpdate={mockUpdate} handleDelete={mockDelete} username={username} />)
  })

  afterEach(() => {
    cleanup()
  })

  test('renders title and author, and does not display details by default', () => {
    const blogHtml = component.container.querySelector('.blog')
    const blogDetails = component.container.querySelector('.blogDetails')
    expect(blogHtml).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(blogDetails).toBe(null)
  })

  test('after clicking the button, details are displayed', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const blogUrl = component.container.querySelector('.blogUrl')
    const blogLikes = component.container.querySelector('.blogLikes')

    expect(blogUrl).toHaveTextContent(blog.url)
    expect(blogLikes).toHaveTextContent(blog.likes)
  })

  test('like button handler gets called on each click', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    likeButton.click()
    likeButton.click()
    expect(mockUpdate).toHaveBeenCalledTimes(2)
  })
})