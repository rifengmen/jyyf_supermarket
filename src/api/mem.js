/**
 * mem模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const mem = {
  // 获取用户昵称等信息
  getMyInfo: data => http.post('mem/member/getMyInfo', data),
  // 获取消费记录列表
  listMemberConsum: data => http.post('mem/member/listMemberConsum', data),
  // 获取消费详情
  listDetails: data => http.post('mem/member/listDetails', data),
  // 获取储值卡付款码
  createPayMoneyStr: data => http.post('mem/member/createPayMoneyStr', data),
  // 获取卡值变化记录列表
  listMoneyCardDtl: data => http.post('mem/card/listMoneyCardDtl', data),
  // 获取评价记录列表
  listShopEvaluation: data => http.post('mem/member/listShopEvaluation', data),
  // 获取积分记录列表
  listScoreDtl: data => http.post('mem/card/listScoreDtl', data),
  // 获取零钱记录列表
  listSmallMoneyDtl: data => http.post('mem/card/listSmallMoneyDtl', data),
  // 获取领券列表
  listCouponForGet: data => http.post('mem/member/listCouponForGet', data),
  // 获取我的优惠券列表
  listCoupon: data => http.post('mem/member/listCoupon', data),
  // 获取优惠券详情
  getCouponDtl: data => http.post('mem/member/getCouponDtl', data),
  // 领取优惠券
  panicCoupon: data => http.post('mem/member/panicCoupon', data)
}

export default mem
