import Vue from 'vue'
import Router from 'vue-router'

const author = () => import(/* webpackChunkName: 'wechart' */ '@/components/author/author')
const register = () => import(/* webpackChunkName: 'login' */ '@/components/login/register')
const index = () => import(/* webpackChunkName: 'index' */ '@/components/index/index')
const search = () => import(/* webpackChunkName: 'index' */ '@/components/search/search')
const searchList = () => import(/* webpackChunkName: 'index' */ '@/components/search/searchList')
const recommendList = () => import(/* webpackChunkName: 'index' */ '@/components/recommendList/recommendList')
const classify = () => import(/* webpackChunkName: 'index' */ '@/components/classify/classify')
const goodsdetail = () => import(/* webpackChunkName: 'index' */ '@/components/goodsdetail/goodsdetail')
const cart = () => import(/* webpackChunkName: 'index' */ '@/components/cart/cart')
const editorder = () => import(/* webpackChunkName: 'index' */ '@/components/editorder/editorder')
const messageList = () => import(/* webpackChunkName: 'message' */ '@/components/messageList/messageList')
const messagedetail = () => import(/* webpackChunkName: 'message' */ '@/components/messageList/messagedetail')
const noticeList = () => import(/* webpackChunkName: 'message' */ '@/components/noticeList/noticeList')
const noticedetail = () => import(/* webpackChunkName: 'message' */ '@/components/noticeList/noticedetail')
const userInfo = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/userInfo')
const recharge = () => import(/* webpackChunkName: 'userinfo' */ '@/components/userInfo/recharge')
const rechargePay = () => import(/* webpackChunkName: 'userinfo' */ '@/components/userInfo/rechargePay')
const payPassword = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/payPassword')
const addressList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/addressList')
const tickList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/tickList')
const orderList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/orderList')
const orderdetail = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/orderdetail')
const againPay = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/againPay')
const userDetail = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/userDetail')
const scan = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/scan')
const scoreList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/scoreList')
const cardMoneyList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/cardMoneyList')
const looseChangeList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/looseChangeList')
const expendList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/expendList')
const expendDetail = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/expendDetail')
const commentList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/commentList')
const commentdetail = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/commentdetail')
const addComment = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/addComment')
const complaintList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/complaintList')
const complaintDetail = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/complaintDetail')
const addComplaint = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/addComplaint')
const lottery = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/lottery')
const lotteryList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/lotteryList')
const userList = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/userList')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: '/author/?#',
  // base: '/?#',
  routes: [
    // 获取微信授权
    {path: '/author', component: author, name: 'author'},
    // 首次登陆去注册
    {path: '/register', component: register, name: 'register'},
    // 首页
    {path: '/', component: index, name: 'index'},
    // 搜索页
    {path: '/search', component: search, name: 'search'},
    // 搜索结果页
    {path: '/searchList', component: searchList, name: 'searchList'},
    // 推荐列表
    {path: '/recommendList', component: recommendList, name: 'recommendList'},
    // 分类
    {path: '/classify', name: 'classify', component: classify},
    // 商品详情
    {path: '/goodsdetail', component: goodsdetail, name: 'goodsdetail'},
    // 购物车
    {path: '/cart', name: 'cart', component: cart},
    // 填写订单
    {path: '/editorder', name: 'editorder', component: editorder},
    // 消息中心
    {path: '/messageList', name: 'messageList', component: messageList},
    // 消息详情
    {path: '/messagedetail', name: 'messagedetail', component: messagedetail},
    // 通知中心
    {path: '/noticeList', name: 'noticeList', component: noticeList},
    // 通知详情
    {path: '/noticedetail', name: 'noticedetail', component: noticedetail},
    // 会员中心
    {path: '/userInfo', name: 'userInfo', component: userInfo},
    // 会员中心-在线充值
    {path: '/recharge', name: 'recharge', component: recharge},
    // 会员中心-充值支付
    {path: '/rechargePay', name: 'rechargePay', component: rechargePay},
    // 会员中心-支付密码
    {path: '/payPassword', name: 'payPassword', component: payPassword},
    // 会员中心-我的地址
    {path: '/addressList', name: 'addressList', component: addressList},
    // 会员中心-优惠券
    {path: '/tickList', name: 'tickList', component: tickList},
    // 会员中心-我的订单
    {path: '/orderList', name: 'orderList', component: orderList},
    // 会员中心-订单详情
    {path: '/orderdetail', name: 'orderdetail', component: orderdetail},
    // 会员中心-再支付
    {path: '/againPay', name: 'againPay', component: againPay},
    // 会员中心-我的资料
    {path: '/userDetail', name: 'userDetail', component: userDetail},
    // 会员中心-拣配确认
    {path: '/scan', name: 'scan', component: scan},
    // 会员中心-积分变化
    {path: '/scoreList', name: 'scoreList', component: scoreList},
    // 会员中心-卡值变化
    {path: '/cardMoneyList', name: 'cardMoneyList', component: cardMoneyList},
    // 会员中心-零钱变化
    {path: '/looseChangeList', name: 'looseChangeList', component: looseChangeList},
    // 会员中心-消费记录
    {path: '/expendList', name: 'expendList', component: expendList},
    // 会员中心-记录详情
    {path: '/expendDetail', name: 'expendDetail', component: expendDetail},
    // 会员中心-购物评价
    {path: '/commentList', name: 'commentList', component: commentList},
    // 会员中心-评价详情
    {path: '/commentdetail', name: 'commentdetail', component: commentdetail},
    // 会员中心-添加评价
    {path: '/addComment', name: 'addComment', component: addComment},
    // 会员中心-投诉建议
    {path: '/complaintList', name: 'complaintList', component: complaintList},
    // 会员中心-投诉详情
    {path: '/complaintDetail', name: 'complaintDetail', component: complaintDetail},
    // 会员中心-添加投诉
    {path: '/addComplaint', name: 'addComplaint', component: addComplaint},
    // 会员中心-积分抽奖
    {path: '/lottery', name: 'lottery', component: lottery},
    // 会员中心-中奖记录
    {path: '/lotteryList', name: 'lotteryList', component: lotteryList},
    // 会员中心列表
    {path: '/userList', name: 'userList', component: userList}
  ]
})

//  使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   let jyyfopenid = sessionStorage.getItem('jyyf_openid')
//   if (!jyyfopenid && to.fullPath !== '/author') {
//     // 保存用户进入的url
//     sessionStorage.setItem('jyyf_beforeLoginUrl', JSON.stringify(to.fullPath))
//     next('/author')
//     return false
//   }
//   next()
// })

export default router
