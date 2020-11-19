/**
 * system模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const system = {
  // 登录
  login: data => http.post('system/customlogin/login', data),
  // 获取卡信息
  getMyInfo: data => http.post('system/customlogin/getMyInfo', data),
  // banner列表
  listShopHomeSlide: data => http.post('system/slide/listShopHomeSlide', data),
  // banner详情
  getLinkForSlide: data => http.post('system/slide/getLinkForSlide', data),
  // 获取门店列表
  listDeptInfo: data => http.post('system/dept/listDeptInfo', data),
  // 获取分类
  getCusClassOption2: data => http.post('system/globaldata/getCusClassOption2', data)
}

export default system
