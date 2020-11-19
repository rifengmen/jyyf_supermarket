const getters = {
  // 获取wechatID
  getWechatID (state) {
    return state.wechatID
  },
  // 获取appid
  getAppid (state) {
    return state.appid
  },
  // 获取openid
  getOpenid (state) {
    return state.openid
  },
  // 获取用户头像
  getHeadimgurl (state) {
    return state.headimgurl
  },
  // 获取用户信息
  getUserInfo (state) {
    return state.userInfo
  },
  // 获取搜索关键字
  getKeyword (state) {
    return state.keyword
  },
  // 获取临时订单收货地址
  getAddress (state) {
    return state.address
  },
  // 获取临时订单优惠券信息
  gettick (state) {
    return state.tick
  },
  // 获取配送服务费
  getFreightmoney (state) {
    return state.freightmoney
  }
}

export default getters
