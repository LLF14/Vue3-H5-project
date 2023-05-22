import request from '@/utils/request'

export const loginAPI = (mobile: string, password: string) => {
  return request({
    url: '/login/password',
    method: 'post',
    data: { mobile, password }
  })
}

export const sendCodeAPI = (mobile: string, type: string = 'login') => {
  return request({
    url: 'code',
    params: { mobile, type }
  })
}

export const codeLoginAPI = (mobile: string, code: string) => {
  return request({
    url: 'login',
    method: 'post',
    data: { mobile, code }
  })
}
