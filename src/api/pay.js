/**
 * pay模块接口列表
 */

import baseURL from './baseURL'
import http from '@/utils/http'

http.defaults.baseURL = baseURL.spzlk

const pay = {
  // 签到
  signInCentChange: data => http.post('pay/bill/member/signInCentChange', data)
}

export default pay
