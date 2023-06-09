import type { KnowledgeParams } from '@/types/consult'
import type { AddPatient } from '@/types/user'
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

export const getUserInfoAPI = () => {
  return request({
    url: '/patient/myUser'
  })
}

/** 获取患者列表 */
export const getPatientListAPI = () => {
  return request({ url: '/patient/mylist' })
}
// 添加患者
export const addPatientAPI = (patient: AddPatient) => {
  return request({ url: '/patient/add', method: 'POST', data: patient })
}
/** 编辑患者 */
export const editPatientAPI = (patient: AddPatient) => {
  return request({ url: '/patient/update', method: 'PUT', data: patient })
}
/** 根据id，删除患者 */
export const delPatientAPI = (id: string) => {
  return request({ url: `/patient/del/${id}`, method: 'DELETE' })
}

export const getKnowledgePageAPI = (params: KnowledgeParams) => {
  return request({ url: '/patient/home/knowledge', params })
}

// 首页医生卡片
export const getDoctorPageAPI = (current = 1, pageSize = 10) => {
  return request({ url: '/home/page/doc', params: { current, pageSize } })
}
