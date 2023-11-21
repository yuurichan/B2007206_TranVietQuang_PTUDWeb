import axios from 'axios'

export default function createClient(baseURL = '') {
  const client = axios.create({ baseURL: `${import.meta.env.VITE_APP_API_URL}/${baseURL}` })

  client.interceptors.request.use((req) => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`
    }

    return req
  })

  client.interceptors.response.use(
    (res) => res.data,
    (error) => {
      throw error.response?.data || error
    }
  )

  return client
}
