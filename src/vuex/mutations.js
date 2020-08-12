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
  // 设置基础路径baseURL
  setBaseURL (state, data) {
    state.baseURL = data
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
  // 设置商品详情
  setGoodsdetail (state, data) {
    state.goodsdetail = data
  },
  // 扫码购设置店铺信息
  setShopInfo (state, data) {
    state.shopInfo = data
  },
  // 扫码购清除店铺信息
  clearShopInfo (state) {
    state.shopInfo = ''
  },
  // 扫码购物车添加商品
  addSaomacar (state, data) {
    state.saomacar.push(data)
  },
  // 清空扫码购物车
  clearSaomacar (state) {
    state.saomacar = []
  },
  // 添加不缓存的组件
  addExcludeComponent (state, data) {
    let excludeComponents = state.excludeComponents
    if (Array.isArray(data)) {
      state.excludeComponents = [...new Set([...excludeComponents, ...data])]
    } else {
      state.excludeComponents = [...new Set([...excludeComponents, data])]
    }
  },
  // 移除不缓存的组件，excludeComponent可能是组件name字符串或者数组
  removeExcludeComponent (state, data) {
    let excludeComponents = state.excludeComponents
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        let index = excludeComponents.findIndex(v => v === data[i])
        if (index > -1) {
          excludeComponents.splice(index, 1)
        }
      }
    } else {
      for (let i = 0, len = excludeComponents.length; i < len; i++) {
        if (excludeComponents[i] === data) {
          excludeComponents.splice(i, 1)
          break
        }
      }
    }
    state.excludeComponents = excludeComponents
  }
}

export default mutations
