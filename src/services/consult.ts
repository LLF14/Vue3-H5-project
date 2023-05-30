import type { KnowledgeParams, FollowType, OrderPreParams, PartialConsult } from '@/types/consult'
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

export const getAllDepAPI = () => request({ url: '/dep/all' })

/** 上传图片API */
export const uploadImageAPI = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request({ url: '/upload', method: 'post', data: fd })
}

// 2.1 请求预支付接口
/** 请求预支付数据 */
export const getPreOrderAPI = (params: OrderPreParams) => {
  return request({
    url: '/patient/consult/order/pre',
    params
  })
}

// 2.2 定义患者详情查询API
/** 查询患者详情 */
export const getPatientDetail = (id: string) => {
  return request({ url: `/patient/info/${id}` })
}

/** 生成订单接口 */
export const createOrderAPI = (data: PartialConsult) => {
  return request({ url: '/patient/consult/order', method: 'POST', data })
}

export type PayParams = {
  paymentMethod: number
  orderId: string
  payCallback: string
}

/** 获取支付地址  0 是微信  1 支付宝 */
export const consultPayApi = (data: PayParams) => {
  return request({ url: '/patient/consult/pay', method: 'post', data })
}

/** 获取订单详情API */
export const getOrderDetailAPI = (orderId: string) => {
  return request({ url: '/patient/consult/order/detail', params: { orderId } })
}
