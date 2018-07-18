'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //新增的環境變數也要加在prod.env.js哦!
  API_PATH: '"https://vue-course-api.hexschool.io"', //api 伺服器路徑
  CUSTOM_PATH: '"circle"', //api 自訂路徑
})
