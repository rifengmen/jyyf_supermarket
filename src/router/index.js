const index = () => import(/* webpackChunkName: 'index' */ '@/components/index/index')

export default [
  // 首页
  {path: '/', component: index, name: 'index', meta: {keepAlive: true}}
]
