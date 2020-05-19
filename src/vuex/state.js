const state = {
  // 店铺wechatID
  // wechatID: 'yksmlm',
  wechatID: '2',
  // wechatID: '',
  // appid
  // appid: 'wx504cefa17f46c39b',
  appid: 'wx700e813e33fcebec',
  // appid: '',
  // 用户openid
  // openid: 'oJkXG1RvLe9HbPHaODobVbQTqWjM',
  openid: 'oWBPAv82A3OaXxPa6neaWv09g90A',
  // openid: '',
  // 用户头像
  headimgurl: '',
  // 用户信息
  userInfo: {
    // customertype: '2',
    // memtypename: '0级会员',
    // coflag: 1,
    // loginname: 18734565827,
    // moneyDetail: '{"couponAmount": 0.0, "smallMoneyBal": 0.0, "totalCent": 500.0, "moneyBal": 1000.03}',
    // mobile: '18734565827',
    // contextPath: '',
    // smgMode: 2,
    // memcode: 99001001,
    // deptname: '测试用户',
    // token: 'token:PC-fadee829886185ae3e9d178188da189f-20200406185354788-645088',
    // validflag: 1,
    // logoPicture: null,
    // memname: '这是昵称',
    // iscustomer: 1,
    // noticeCount: 7,
    // customerid: 102208,
    // wechatID: 'E6B40FD4-191E-4D03-9FA1-317D90D8CCF7',
    // newMessage: 0
  },
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
  // 推荐主题id
  recommendid: '',
  // 推荐主题标题
  recommendName: '',
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
  // 下拉刷新请求开关
  isPullingDown: true,
  // 上拉加载请求开关
  isPullingUp: true
}

export default state
