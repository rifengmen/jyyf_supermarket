'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.29.123:8084/"' // 开发环境服务器地址
  // API_ROOT: '"http://127.0.0.1:8084/"' // 开发环境服务器地址
  // API_ROOT: '"https://www.spzlk.cn/phptest/"' // 开发环境服务器地址
})
