const register = () => import(/* webpackChunkName: 'login' */ '@/components/login/register')

export default [
  // 注册
  {path: '/register', component: register, name: 'register'}
]
