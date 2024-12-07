import RYRequest from './request'
import { URL, TIME_OUT } from './config'

const ryRequest = new RYRequest({
    baseURL: URL,
    timeout: TIME_OUT,
    withCredentials: true,
    interceptors: {
        responseSuccess(res) {
            return res.data
        }
    }
})

export default ryRequest
