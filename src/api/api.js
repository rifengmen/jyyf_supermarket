/**
 * api模块接口列表
 */

import baseURL from './baseURL'
import http from '@/utils/http'

http.defaults.baseURL = baseURL.spzlk

const api = {
  // 微信api注册
  getWXConfig: data => http.post('api/payment/getWXConfig', data),
  // 搜索商品关键字
  searchGoodsRecord: data => http.post('api/goods/searchGoodsRecord', data),
  // 获取首页集群
  listThemeAndGdscode: data => http.post('api/goods/listThemeAndGdscode', data),
  // 获取分类商品列表
  listGoodsForCategory: data => http.post('api/goods/listGoodsForCategory', data),
  // 获取集群商品列表
  getProductListByCate: data => http.post('api/goods/getProductListByCate', data),
  // 获取商品详情
  getById: data => http.post('api/goods/getById', data),
  // 获取购物车列表
  getCar: data => http.post('api/car/getCar', data),
  // 发起拼团
  groupAdd: data => http.post('api/goods/groupAdd', data),
  // 加入拼团校验
  getGroupInfo: data => http.post('api/goods/getGroupInfo', data),
  // 加入拼团
  groupEnd: data => http.post('api/goods/groupEnd', data),
  // 获取拼团信息
  groupIncrease: data => http.post('api/goods/groupIncrease', data),
  // 发起砍价
  hackAdd: data => http.post('api/goods/hackAdd', data),
  // 参与砍价
  hackIncrease: data => http.post('api/goods/hackIncrease', data),
  // 获取砍价信息
  generateHackBill: data => http.post('api/goods/generateHackBill', data),
  // 加入购物车
  addCar: data => http.post('api/car/addCar', data),
  // 修改购物车数量
  modifyCar: data => http.post('api/car/modifyCar', data),
  // 删除购物车商品
  deleteCar: data => http.post('api/car/deleteCar', data),
  // 获取地址列表
  getAddressForOrder: data => http.post('api/area/getAddressForOrder', data),
  // 保存地址
  addAddress: data => http.post('api/area/addAddress', data),
  // 删除地址
  deleteAddress: data => http.post('api/area/deleteAddress', data),
  // 请求片列表
  getArea: data => http.post('api/area/getArea', data),
  // 请求区列表
  getFlat: data => http.post('api/area/getFlat', data),
  // 获取订单列表
  getOrder: data => http.post('api/order/getOrder', data),
  // 获取订单详情
  getOrderDtl: data => http.post('api/order/getOrderDtl', data),
  // 变更订单状态（拣货、配送）
  pickOrder: data => http.post('api/order/pickOrder', data),
  // 变更订单状态（取货）
  pickOutOrder: data => http.post('api/order/pickOutOrder', data),
  // 取消订单
  cancleOrder: data => http.post('api/order/cancleOrder', data),
  // 删除订单
  deleteOrder: data => http.post('api/order/deleteOrder', data),
  // 添加评价
  addAppraise: data => http.post('api/goods/addAppraise', data)
}

export default api
