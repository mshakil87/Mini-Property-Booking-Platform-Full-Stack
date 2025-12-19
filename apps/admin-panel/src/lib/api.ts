import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

export function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getToken() {
  return localStorage.getItem('token')
}
