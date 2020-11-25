/**
 * mem模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const mem = {
  // 获取储值卡付款码
  createPayMoneyStr: data => http.post('mem/member/createPayMoneyStr', data)
}

export default mem
