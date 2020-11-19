/**
 * invest模块接口列表
 */

import baseURL from './baseURL' // 导入接口域名列表
import http from '@/utils/http' // 导入http中创建的axios实例

http.defaults.baseURL = baseURL.spzlk

const invest = {
  // 扫码购获取订单号
  getFlowno: data => http.post('invest/microFlow/getFlowno', data),
  // 扫码购获取商品信息
  getProductDetailsByBarcode: data => http.post('invest/microFlow/getProductDetailsByBarcode', data),
  // 扫码购生成订单
  saveFlow: data => http.post('invest/microFlow/saveFlow', data),
  // 扫码购订单列表
  listMicroFlow: data => http.post('invest/microFlow/listMicroFlow', data),
  // 扫码购订单详情
  listMicroFlowDtl: data => http.post('invest/microFlow/listMicroFlowDtl', data),
  // 扫码购获取支付方式列表
  getMicroFlowPayMoney: data => http.post('invest/microFlow/getMicroFlowPayMoney', data),
  // 扫码购支付
  microFlowToPay: data => http.post('invest/microFlow/microFlowToPay', data),
  // 扫码购取消订单
  cancelSaleOrder: data => http.post('invest/microFlow/cancelSaleOrder', data)
}

export default invest
