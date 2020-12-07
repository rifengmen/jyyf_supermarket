/**
 * bill模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const bill = {
  // 请求可用积分
  payMoneyjf: data => http.post('bill/pay/payMoneyjf', data),
  // 请求可用优惠券
  payMoneytick: data => http.post('bill/pay/payMoneytick', data),
  // 开启支付密码
  cardpayopen: data => http.post('bill/pay/cardpayopen', data),
  // 重置支付密码
  payPasswordReset: data => http.post('bill/pay/payPasswordReset', data),
  // 关闭支付密码
  cardpayclose: data => http.post('bill/pay/cardpayclose', data)
}

export default bill
