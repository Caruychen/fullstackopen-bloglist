import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const postComment = async (text, blogID) => {
  const response = await axios.post(`${baseUrl}/${blogID}/comments`, { text })
  return response.data
}

const update = async blog => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, { likes: blog.likes })
  return response.data
}

const remove = async blog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response
}

export default { getAll, create, update, remove, setToken, postComment }