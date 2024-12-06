import RYRequest from './request'
import { BASE_URL, TIME_OUT } from './config'

const ryRequest = new RYRequest({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    withCredentials: true,
    interceptors: {
        responseSuccess(res) {
            return res.data
        }
    }
})

export default ryRequest
