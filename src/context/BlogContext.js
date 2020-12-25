import createDataContext from './createDataContext'
import jsonServer from '../api/jsonServer'

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_BLOGPOST':
      return state.filter(blogPost => blogPost.id !== action.payload)
    case 'EDIT_BLOGPOST':
      return state.map(blogPost => (
        blogPost.id === action.payload.id ? action.payload : blogPost
      ))
    case 'GET_BLOGPOSTS':
      return action.payload
    default:
      return state
  }
}

const getBlogPosts = dispatch => (
  async () => {
    const res = await jsonServer.get('/blogPosts')
    dispatch({ type: 'GET_BLOGPOSTS', payload: res.data })
  }
)

const addBlogPost = () => (
  async (title, content, callback) => {
    jsonServer.post('/blogposts', { title, content })
    if (callback) {
      callback()
    }
  }
)

const deleteBlogPost = dispatch => (
  async id => {
    await jsonServer.delete(`/blogposts/${id}`)
    dispatch({ type: 'DELETE_BLOGPOST', payload: id })
  }
)

const editBlogPost = dispatch => (
  async (id, title, content, callback) => {
    await jsonServer.put(`/blogposts/${id}`, {
      title,
      content,
    })
    dispatch({
      type: 'EDIT_BLOGPOST',
      payload: { id, title, content }
    })
    if (callback) {
      callback()
    }
  }
)

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
)