export const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]

export const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8~24位字符' }
]

export const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\w{6}$/, message: '验证码需6位字符' }
]
