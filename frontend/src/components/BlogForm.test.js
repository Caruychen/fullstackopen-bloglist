import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, cleanup } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  afterEach(() => {
    cleanup()
  })

  test('calls handler on submit', () => {
    const createBlog = jest.fn().mockName('createBlog')
    const component = render(<BlogForm createBlog={createBlog} />)

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, { target: { value: 'Test title' } })
    fireEvent.change(authorInput, { target: { value: 'John Smith' } })
    fireEvent.change(urlInput, { target: { value: 'http://www.testurl.com' } })
    fireEvent.submit(form)

    expect(createBlog).toBeCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({ title: 'Test title', author: 'John Smith', url: 'http://www.testurl.com' })
  })
})