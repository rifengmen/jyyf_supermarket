const userInfo = () => import(/* webpackChunkName: 'userInfo' */ '@/components/userInfo/userInfo')
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

export default [
  // 会员中心
  {path: '/userInfo', name: 'userInfo', component: userInfo},
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
  {path: '/addComplaint', name: 'addComplaint', component: addComplaint}
]