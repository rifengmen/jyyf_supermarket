const search = () => import(/* webpackChunkName: 'shopping' */ '@/components/search/search')
const searchList = () => import(/* webpackChunkName: 'shopping' */ '@/components/search/searchList')
const recommendList = () => import(/* webpackChunkName: 'shopping' */ '@/components/shopList/recommendList')
const classify = () => import(/* webpackChunkName: 'shopping' */ '@/components/classify/classify')
const goodsdetail = () => import(/* webpackChunkName: 'shopping' */ '@/components/goodsdetail/goodsdetail')
const classList = () => import(/* webpackChunkName: 'shopping' */ '@/components/shopList/classList')
const cart = () => import(/* webpackChunkName: 'shopping' */ '@/components/cart/cart')
const editorder = () => import(/* webpackChunkName: 'shopping' */ '@/components/editorder/editorder')

export default [
  // 搜索页
  {path: '/search', component: search, name: 'search'},
  // 搜索结果页
  {path: '/searchList', component: searchList, name: 'searchList', meta: {keepAlive: true}},
  // 推荐列表
  {path: '/recommendList', component: recommendList, name: 'recommendList'},
  // 分类
  {path: '/classify', name: 'classify', component: classify, meta: {keepAlive: true}},
  // 分类列表
  {path: '/classList', name: 'classList', component: classList},
  // 商品详情
  {path: '/goodsdetail', component: goodsdetail, name: 'goodsdetail'},
  // 购物车
  {path: '/cart', name: 'cart', component: cart},
  // 填写订单
  {path: '/editorder', name: 'editorder', component: editorder}
]
