const saomagou = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/saomagou')
const saomacar = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/saomacar')
const manual = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/manual')
const saomaorder = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/saomaorder')
const saomaorderList = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/saomaorderList')
const saomaorderDetail = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/saomaorderDetail')
const saomabar = () => import(/* webpackChunkName: 'saomagou' */ '@/components/saomagou/saomabar')

export default [
  // 扫码购首页
  {path: '/saomagou', name: 'saomagou', component: saomagou},
  // 扫码购购物车
  {path: '/saomacar', name: 'saomacar', component: saomacar},
  // 手动输入
  {path: '/manual', name: 'manual', component: manual},
  // 扫码购填写订单
  {path: '/saomaorder', name: 'saomaorder', component: saomaorder},
  // 扫码购订单列表
  {path: '/saomaorderList', name: 'saomaorderList', component: saomaorderList, meta: {keepAlive: true}},
  // 扫码购订单详情
  {path: '/saomaorderDetail', name: 'saomaorderDetail', component: saomaorderDetail},
  // 扫码购出场码
  {path: '/saomabar', name: 'saomabar', component: saomabar}
]
