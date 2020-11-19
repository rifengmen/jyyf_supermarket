import axios from 'axios'
// import QS from 'qs'
// import router from '@/router/router'
import store from '@/vuex/store'
import tip from '@/utils/Toast'

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */

const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 403
    case 403:
      tip('403，禁止访问')
      break
    // 404
    case 404:
      tip('404，无法找到文件')
      break
    // 405
    case 405:
      tip('405，资源被禁止')
      break
    // 408
    case 408:
      tip('408，请求超时')
      break
    default:
      tip(other)
  }
}

// 创建axios实例
var http = axios.create({
  // 60秒超时
  timeout: 1000 * 60
})
// 设置post请求头
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

http.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = store.state.token
    token && (config.headers.Authorization = token)
    // 设置请求数据
    let data = new FormData()
    data.append('requestData', JSON.stringify(config.data))
    config.data = data
    return config
  },
  error => Promise.error(error)
)

/**
 * 响应拦截器
 */

http.interceptors.response.use(
  // 请求成功
  result => result.status === 200 ? Promise.resolve(result) : Promise.reject(result),
  // 请求失败
  error => {
    const { response } = error
    // 请求已发出，但是不在2xx的范围
    errorHandle(response.status, response.data.message)
    return Promise.reject(response)
  }
)

export default http
