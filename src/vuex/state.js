const state = {
  // 店铺wechatID
  wechatID: '2',
  // wechatID: 'LCHLG',
  // wechatID: '',
  // appid
  appid: 'wx700e813e33fcebec',
  // appid: 'wx0157c53ba4e659f3', // LCHLG
  // appid: '',
  // 用户openid
  // openid: 'oWBPAv2kv3TxjGHCGVeWQqZfGhqw',
  openid: 'oWBPAv82A3OaXxPa6neaWv09g90A',
  // openid: 'oWBPAv1-db9Sy3F26H9bZUcId9_g',
  // openid: 'oWBPAvz0mRjmzCRLGXLgfhhRjz7I',
  // openid: 'ouG8UwjRuZFkhiyowhH8pqBXVJIE', // LCHLG
  // openid: '',
  // 基础路径
  baseURL: 'https://www.spzlk.cn',
  // baseURL: '',
  // 路由开关
  isRouter: true,
  // isRouter: false,
  // 用户头像
  headimgurl: '',
  // 用户信息
  userInfo: {},
  // 用户会员等级
  mem_type: '',
  // 卡片信息
  moneyDetail: '',
  // 充值类型
  moneyType: '',
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
  goodsdetail: '',
  // 扫码购店铺信息
  shopInfo: '',
  // 扫码购物车
  saomacar: [],
  // 缓存的组件
  excludeComponents: []
}

export default state
