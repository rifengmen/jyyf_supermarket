'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://192.168.29.118:8083/"', // 开发环境服务器地址
  // API_ROOT: '"http://192.168.1.22:8083/"', // 开发环境服务器地址
  API_ROOT: '"https://member.spzlk.cn/phptest/"', // 开发环境服务器地址
  VUE_APP_IMG_BASEURL: '"http://member.spzlk.cn:8000/wemember/"' // 开发环境图片基础路径
})
