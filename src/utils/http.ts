import axios from 'axios'

export interface ApiEnvelope<T = unknown> {
  code?: number
  message?: string
  data?: T
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('bajie_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use((response) => {
  const payload = response.data as ApiEnvelope | undefined

  if (typeof payload?.code === 'number' && payload.code !== 0) {
    return Promise.reject(new Error(payload.message || '请求失败'))
  }

  return response
})

export const getErrorMessage = (error: unknown, fallback = '请求失败') => {
  if (axios.isAxiosError<ApiEnvelope>(error)) {
    return error.response?.data?.message || error.message || fallback
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  return fallback
}
