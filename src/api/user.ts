import { http, type ApiEnvelope } from '@/utils/http'

export interface CaptchaData {
  captcha_id?: string
  captcha_image?: string
}

export interface LoginParams {
  username: string
  password: string
  captcha_id: string
  captcha_code: string
}

export interface LoginData {
  token?: string
  access_token?: string
  [key: string]: unknown
}

export const getCaptcha = async () => {
  const { data } = await http.get<ApiEnvelope<CaptchaData>>('/v1/user/captcha')

  return data.data || {}
}

export const login = async (params: LoginParams) => {
  const { data } = await http.post<ApiEnvelope<LoginData>>('/v1/user/login', params)

  return {
    message: data.message,
    data: data.data || {},
    raw: data,
  }
}
