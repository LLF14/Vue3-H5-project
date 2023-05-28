import type { KnowledgeParams, FollowType } from '@/types/consult'
import type { AddPatient } from '@/types/user'
import request from '@/utils/request'

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

export const followDoctorAPI = (id: string, type: FollowType = 'doc') => {
  return request({ url: '/like', method: 'POST', data: { id, type } })
}
