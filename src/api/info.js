/**
 * info模块接口列表
 */

import baseURL from './baseURL'
import http from '@/utils/http'

http.defaults.baseURL = baseURL.spzlk

const info = {
  // 获取消息列表
  listmessage: data => http.post('info/InformationController/listmessage', data),
  // 获取公告列表
  listNotice: data => http.post('info/InformationController/listNotice', data)
}

export default info
