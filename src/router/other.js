const recharge = () => import(/* webpackChunkName: 'other' */ '@/components/other/recharge')
const rechargePay = () => import(/* webpackChunkName: 'other' */ '@/components/other/rechargePay')
const lottery = () => import(/* webpackChunkName: 'other' */ '@/components/other/lottery')
const lotteryList = () => import(/* webpackChunkName: 'other' */ '@/components/other/lotteryList')

export default [
  // 其他-在线充值
  {path: '/recharge', name: 'recharge', component: recharge},
  // 其他-充值支付
  {path: '/rechargePay', name: 'rechargePay', component: rechargePay},
  // 其他-积分抽奖
  {path: '/lottery', name: 'lottery', component: lottery},
  // 其他-中奖记录
  {path: '/lotteryList', name: 'lotteryList', component: lotteryList}
]
