/**
 * api模块接口列表
 */

import baseURL from './baseURL'
import http from '@/utils/http'

http.defaults.baseURL = baseURL.spzlk

const api = {
  // 微信api注册
  getWXConfig: data => http.post('api/payment/getWXConfig', data),
  // 获取订单列表
  getOrder: data => http.post('api/order/getOrder', data),
  // 获取首页集群
  listThemeAndGdscode: data => http.post('api/goods/listThemeAndGdscode', data),
  // 获取分类商品列表
  listGoodsForCategory: data => http.post('api/goods/listGoodsForCategory', data),
  // 获取购物车列表
  getCar: data => http.post('api/car/getCar', data),
  // 修改购物车数量
  modifyCar: data => http.post('api/car/modifyCar', data),
  // 删除购物车商品
  deleteCar: data => http.post('api/car/deleteCar', data)
}

export default api
