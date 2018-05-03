// 引用axios
import axios from 'axios'

// 配置API接口地址
const root = 'http://suyuan.118.easysoft168.com/Api/api'
// qs序列化，解决data传参，后台无法接受的问题
const qs = require('querystring')


// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}


function apiAxios (method, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  params.appid = '1'
  params.token = '11111111111111111111111111111111'
  axios({
    method: method,
    data: method === 'POST' || method === 'PUT' ? qs.stringify(params) : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false,
  }).then(function (res) {
    if (res.data.code === 0) {
      success(res.data)
    } else {
      failure(res.data)
    }
  }).catch(function (err) {
    let res = err.response
    if (err) {
      console.error(err.message)
    }
  })
}

// 返回在vue模板中的调用接口
export default {
  get: function (params, success, failure) {
    return apiAxios('GET', params, success, failure)
  },
  post: function (params, success, failure) {
    return apiAxios('POST', params, success, failure)
  },
  put: function (params, success, failure) {
    return apiAxios('PUT', params, success, failure)
  },
  delete: function (params, success, failure) {
    return apiAxios('DELETE', params, success, failure)
  }
}
