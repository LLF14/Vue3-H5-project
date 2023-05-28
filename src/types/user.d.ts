export interface User {
  /**
   * 用户名
   */
  account?: string
  /**
   * 头像
   */
  avatar?: string
  /**
   * 用户id
   */
  id?: string
  /**
   * 脱敏手机号，带星号的手机号
   */
  mobile?: string
  /**
   * refreshToken
   */
  refreshToken: string
  /**
   * token
   */
  token: string
}

export interface UserInfo {
  /**
   * 用户名
   */
  account: string
  /**
   * 头像
   */
  avatar: string
  /**
   * 收藏数量
   */
  collectionNumber: number
  /**
   * 问诊中信息
   */
  consultationInfo: ConsultationInfo[]
  /**
   * 我的优惠券数量
   */
  couponNumber: number
  /**
   * 用户id
   */
  id: string
  /**
   * 关注数量
   */
  likeNumber: number
  /**
   * 手机号
   */
  mobile: string
  orderInfo: OrderInfo
  /**
   * 我的总积分
   */
  score: number
}

/**
 * 问诊中信息
 */
export interface ConsultationInfo {
  /**
   * 医生头像
   */
  avatar: string
  /**
   * 科室
   */
  depName: string
  /**
   * 医院等级
   */
  gradeName: string
  /**
   * 医院名称
   */
  hospitalName: string
  /**
   * 医生id
   */
  id: string
  /**
   * 医生姓名
   */
  name: string
  /**
   * 订单id
   */
  orderId: string
  /**
   * 职称
   */
  positionalTitles: string
}

export interface OrderInfo {
  /**
   * 已完成
   */
  finishedNumber: number
  /**
   * 待付款
   */
  paidNumber: number
  /**
   * 待发货
   */
  receivedNumber: number
  /**
   * 待收货
   */
  shippedNumber: number
}

export interface Patient {
  /**
   * 年龄
   */
  age?: number
  /**
   * 是否设置为默认患者 0不是默认 1是默认患者
   */
  defaultFlag: number
  /**
   * 性别 1男 0女
   */
  gender: number
  /**
   * 性别值
   */
  genderValue: string
  id: string
  /**
   * 患者身份证号
   */
  idCard: string
  /**
   * 患者姓名
   */
  name: string
}

export type AddPatient = Pick<Patient, 'name' | 'idCard' | 'defaultFlag' | 'gender'> & {
  id?: string
}
