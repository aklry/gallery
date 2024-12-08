import RYRequest from './request'
import { URL, TIME_OUT } from './config'
import { message } from 'ant-design-vue'
const ryRequest = new RYRequest({
    baseURL: URL,
    timeout: TIME_OUT,
    withCredentials: true,
    interceptors: {
        responseSuccess(res) {
            if (res.data.code === 40100) {
                if (
                    !res.request.responseURL.includes('user/get/login') &&
                    !window.location.pathname.includes('/user/login')
                ) {
                    message.error('请先登录')
                    window.location.href = `/user/login?redirect=${window.location.href}`
                }
            }
            return res.data
        }
    }
})

export default ryRequest
