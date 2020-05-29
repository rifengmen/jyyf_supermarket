const state = {
  // 店铺wechatID
  wechatID: '2',
  // wechatID: '',
  // appid
  appid: 'wx700e813e33fcebec',
  // appid: '',
  // 用户openid
  openid: 'oWBPAv82A3OaXxPa6neaWv09g90A',
  // openid: '',
  // 基础路径
  baseURL: 'https://www.spzlk.cn',
  // baseURL: '',
  // 用户头像
  headimgurl: '',
  // 用户信息
  userInfo: {},
  // 卡片信息
  moneyDetail: '',
  // 促销类型
  Promotemode: {
    0: '正常',
    1: '特价',
    2: '满量折',
    3: '满量减',
    4: '',
    5: '',
    6: '拼团',
    7: '秒杀',
    8: '砍价',
    9: '',
    10: '',
    11: ''
  },
  // 搜索关键字
  keyword: '',
  // 购物车
  cart: {},
  // 购物车商品数量
  cartnums: 0,
  // 临时订单信息
  order: '',
  // 临时订单积分抵扣
  score: '',
  // 临时订单收货地址
  address: '',
  // 临时订单配送服务费
  freightmoney: '',
  // 临时订单优惠券信息
  tick: '',
  // 商品详情，用作分享商品
  goodsdetail: ''
}

export default state
