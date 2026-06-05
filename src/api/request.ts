import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    ElMessage.error(error?.message || '请求失败，请稍后重试')
    return Promise.reject(error)
  }
)

export default request
