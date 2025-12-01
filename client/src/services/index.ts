import RYRequest from './request'
import { URL, TIME_OUT } from './config'
import { message } from 'ant-design-vue'
import md5 from 'md5'
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
                    window.location.href = `/user/login?redirect=${window.location.pathname}`
                }
            }
            return res.data
        },
        requestSuccess(config) {
            const signKey = 'aklry'
            const st = Date.now()
            if (config.headers) {
                config.headers['s_t'] = st
                config.headers['s_sign'] = md5(`${signKey}_${st}`)
            }
            return config
        }
    }
})

export default ryRequest
