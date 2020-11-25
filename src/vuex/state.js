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
  // 路由开关
  isRouter: true,
  // isRouter: false,
  // token
  token: '',
  // 用户头像
  headimgurl: '',
  // 用户信息
  userInfo: {},
  // 用户会员等级
  mem_type: '',
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
    9: '预售'
  },
  // 搜索关键字
  keyword: '',
  // 购物车
  cart: {},
  // 购物车商品数量
  cartnums: 0,
  // 订单类型
  orderType: [
    {name: '购物车去结算', isotc: '', otc: '', orderType: ''},
    {name: '拼团立即购买', isotc: 'otc', otc: 'group', orderType: ''},
    {name: '砍价立即购买', isotc: 'otc', otc: 'hack', orderType: ''},
    {name: '普通立即购买', isotc: '', otc: 'voucher', orderType: 0},
    {name: '发起拼团购买', isotc: 'group', otc: 'group', orderType: 1},
    {name: '参与拼团购买', isotc: 'group', otc: 'group', orderType: 2},
    {name: '砍价成功购买', isotc: 'hack', otc: 'hack', orderType: 3},
    {name: '代金券立即购买', isotc: '', otc: 'voucher', orderType: 4},
    {name: '预售立即购买', isotc: '', otc: 'voucher', orderType: 5}
  ],
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
