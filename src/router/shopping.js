const search = () => import(/* webpackChunkName: 'shopping' */ '@/components/shopList/search')
const searchList = () => import(/* webpackChunkName: 'shopping' */ '@/components/shopList/searchList')
const recommendList = () => import(/* webpackChunkName: 'shopping' */ '@/components/shopList/recommendList')
const category = () => import(/* webpackChunkName: 'shopping' */ '@/components/category/category')
const goodsdetail = () => import(/* webpackChunkName: 'shopping' */ '@/components/goodsdetail/goodsdetail')
const classList = () => import(/* webpackChunkName: 'shopping' */ '@/components/shopList/classList')
const cart = () => import(/* webpackChunkName: 'shopping' */ '@/components/cart/cart')
const editorder = () => import(/* webpackChunkName: 'shopping' */ '@/components/editorder/editorder')

export default [
  // 搜索页
  {path: '/search', component: search, name: 'search', meta: {keepAlive: true}},
  // 搜索结果页
  {path: '/searchList', component: searchList, name: 'searchList', meta: {keepAlive: true}},
  // 推荐列表
  {path: '/recommendList', component: recommendList, name: 'recommendList', meta: {keepAlive: true}},
  // 分类
  {path: '/category', name: 'category', component: category, meta: {keepAlive: true}},
  // 分类列表
  {path: '/classList', name: 'classList', component: classList, meta: {keepAlive: true}},
  // 商品详情
  {path: '/goodsdetail', name: 'goodsdetail', component: goodsdetail},
  // 购物车
  {path: '/cart', name: 'cart', component: cart},
  // 填写订单
  {path: '/editorder', name: 'editorder', component: editorder}
]
