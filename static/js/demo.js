// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
// let userToken = window.localStorage.getItem('jyyf_userToken')
// if (!userToken && to.fullPath !== '/author') {
// 保存用户进入的url
//   window.localStorage.setItem('jyyf_beforeLoginUrl', JSON.stringify(to.fullPath))
//   next('/author')
//   return false
// }

// 获取权限验证配置(签名) 后端返回 getConfig, 注意返回字段的大小写!
// let res
// 注入配置信息
// wx.config({
//   debug: false, // 调试开关
//   appId: res.appId, // 必填，公众号的唯一标识
//   timestamp:res.timestamp , // 必填，生成签名的时间戳
//   nonceStr: res.nonceStr, // 必填，生成签名的随机串
//   signature: res.signature,// 必填，签名
//   jsApiList: ["updateAppMessageShareData","updateTimelineShareData"] // 必填，需要使用的JS接口列表
// });
// wx.ready(() => {
// doSoming
// });

// next()
// })
