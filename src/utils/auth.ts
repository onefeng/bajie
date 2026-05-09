import type { LoginData } from '@/api/user'

const TOKEN_KEY = 'bajie_token'
const LOGIN_DATA_KEY = 'bajie_login_data'
const USERNAME_KEY = 'bajie_username'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUsername = () => localStorage.getItem(USERNAME_KEY) || 'admin'

export const isLoggedIn = () => Boolean(getToken() || localStorage.getItem(LOGIN_DATA_KEY))

export const saveLoginSession = (username: string, data: LoginData, raw: unknown) => {
  const token = data.token || data.access_token || ''

  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(Object.keys(data).length > 0 ? data : raw))
  localStorage.setItem(USERNAME_KEY, username)
}

export const clearLoginSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(LOGIN_DATA_KEY)
  localStorage.removeItem(USERNAME_KEY)
}
