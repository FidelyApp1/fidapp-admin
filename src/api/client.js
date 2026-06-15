import axios from 'axios'

const api = axios.create({
  baseURL: 'https://fidapp-backend-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fidapp_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const adminLogin = async (email, password) => {
  const res = await api.post('/admin/login', { email, password })
  return res.data
}

export const getRestaurants = async () => {
  const res = await api.get('/admin/restaurants')
  return res.data
}

export const createRestaurant = async (data) => {
  const res = await api.post('/admin/restaurants', data)
  return res.data
}

export const updateRestaurant = async (id, data) => {
  const res = await api.put(`/admin/restaurants/${id}`, data)
  return res.data
}

export const deleteRestaurant = async (id) => {
  const res = await api.delete(`/admin/restaurants/${id}`)
  return res.data
}

export const getRestaurantStats = async (id) => {
  const res = await api.get(`/admin/restaurants/${id}/stats`)
  return res.data
}

export default api