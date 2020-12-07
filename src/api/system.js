/**
 * system模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const system = {
  // 获取商户id
  getPrimaryKey: data => http.post('system/customlogin/getPrimaryKey', data),
  // 获取用户id
  getOpenID: data => http.post('system/customlogin/getOpenID', data),
  // 获取图形验证码
  getVerifyCodeGraphic: data => http.post('system/customlogin/getVerifyCodeGraphic', data),
  // 获取短信验证码
  getCheckCode: data => http.post('system/customlogin/getCheckCode', data),
  // 注册
  registerAndLogin: data => http.post('system/customlogin/registerAndLogin', data),
  // 登录
  login: data => http.post('system/customlogin/login', data),
  // 验证卡包
  getWeiXinCardList: data => http.post('system/customlogin/getWeiXinCardList', data),
  // 完善资料
  modifyname: data => http.post('system/customlogin/modifyname', data),
  // 获取用户账户信息
  getMyInfo: data => http.post('system/customlogin/getMyInfo', data),
  // 获取电子会员卡
  myCard: data => http.post('system/customlogin/myCard', data),
  // 获取分类
  getCusClassOption2: data => http.post('system/globaldata/getCusClassOption2', data),
  // banner列表
  listShopHomeSlide: data => http.post('system/slide/listShopHomeSlide', data),
  // banner详情
  getLinkForSlide: data => http.post('system/slide/getLinkForSlide', data),
  // 获取门店列表
  listDeptInfo: data => http.post('system/dept/listDeptInfo', data),
  // 获取投诉建议列表
  listSuggestion: data => http.post('system/suggestion/listSuggestion', data),
  // 添加投诉建议
  addSuggestion: data => http.post('system/suggestion/addSuggestion', data),
  // 获取投诉建议详情
  listSuggestionDtl: data => http.post('system/suggestion/listSuggestionDtl', data),
  // 获取奖品列表
  getPrizeList: data => http.post('system/prize/getPrizeList', data),
  // 获取抽奖结果
  centPrize: data => http.post('system/prize/centPrize', data),
  // 获取中奖记录列表
  listPrizeLog: data => http.post('system/prize/listPrizeLog', data)
}

export default system
