const author = () => import(/* webpackChunkName: 'wechart' */ '@/components/author/author')

export default [
  // 获取微信授权
  {path: '/author', component: author, name: 'author'}
]
