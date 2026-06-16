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
export const getGlobalStats = async () => {
  const res = await api.get('/admin/stats')
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
export const resetRestaurantPassword = async (id, newPassword) => {
  const res = await api.post(`/admin/restaurants/${id}/reset-password`, { newPassword })
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
export const getAllClients = async () => {
  const res = await api.get('/admin/clients')
  return res.data
}
export const getAllCheckins = async () => {
  const res = await api.get('/admin/checkins')
  return res.data
}
export const getAllRewards = async () => {
  const res = await api.get('/admin/rewards')
  return res.data
}
export const updateAdminPassword = async (currentPassword, newPassword) => {
  const res = await api.put('/admin/me/password', { currentPassword, newPassword })
  return res.data
}

export default api