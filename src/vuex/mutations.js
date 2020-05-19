const mutations = {
  // 设置wechatID
  setWechatID (state, data) {
    state.wechatID = data
  },
  // 设置appid
  setAppid (state, data) {
    state.appid = data
  },
  // 设置openid
  setOpenid (state, data) {
    state.openid = data
  },
  // 设置用户头像
  setHeadimgurl (state, data) {
    state.headimgurl = data
  },
  // 设置userToken
  setUserToken (state, data) {
    state.userToken = data
  },
  // 设置登陆用户信息
  setUserInfo (state, data) {
    state.userInfo = data
  },
  // 设置卡片信息
  setMoneyDetail (state, data) {
    state.moneyDetail = JSON.parse(data)
  },
  // 设置推荐主题id
  setRecommendid (state, data) {
    state.recommendid = data
  },
  // 设置推荐主题标题
  setRecommendName (state, data) {
    state.recommendName = data
  },
  // 设置搜索关键字
  setKeyword (state, data) {
    state.keyword = data
  },
  // 设置购物车
  setCart (state, data) {
    state.cart = data
  },
  // 设置购物车商品数量
  setCartnums (state, data) {
    state.cartnums = data
  },
  // 设置临时订单信息
  setOrder (state, data) {
    state.order = data
  },
  // 设置临时订单积分抵扣
  setScore (state, data) {
    state.score = data
  },
  // 设置临时订单收货地址
  setAddress (state, data) {
    state.address = data
  },
  // 设置临时订单配送服务费
  setFreightmoney (state, data) {
    state.freightmoney = data
  },
  // 设置临时订单优惠券信息
  setTick (state, data) {
    state.tick = data
  },
  // 设置下拉刷新请求开关
  setIsPullingDown (state, isPullingDown) {
    state.isPullingDown = isPullingDown
  },
  // 设置上拉加载请求开关
  setIsPullingUp (state, isPullingUp) {
    state.isPullingUp = isPullingUp
  }
}

export default mutations
