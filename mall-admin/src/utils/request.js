import axios from 'axios'

// 创建 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:9002', // 从环境变量获取基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    console.log(token,'token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // HTTP 状态码错误处理
      switch (error.response.status) {
        case 401:
          // 跳转到登录页
          window.location.href = '/login'
          break
        case 403:
          // 权限不足提示
          console.error('无权访问')
          break
        case 404:
          console.error('资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('未知错误')
      }
    }
    return Promise.reject(error)
  }
)

export default instance