/**
 * bill模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const bill = {
  // 请求可用积分
  payMoneyjf: data => http.post('bill/pay/payMoneyjf', data)
}

export default bill
