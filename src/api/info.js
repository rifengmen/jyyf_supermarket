/**
 * info模块接口列表
 */

import baseURL from './baseURL'
import http from '@/utils/http'

http.defaults.baseURL = baseURL.spzlk

const info = {
  // 获取消息列表
  listmessage: data => http.post('info/InformationController/listmessage', data),
  // 获取消息详情
  listDtl: data => http.post('info/InformationController/listDtl', data),
  // 获取公告列表
  listNotice: data => http.post('info/InformationController/listNotice', data),
  // 获取公告详情
  listNoticeDtl: data => http.post('info/InformationController/listNoticeDtl', data)
}

export default info
