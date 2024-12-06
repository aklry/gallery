import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RYRequestConfig } from './type'

class RYRequest {
    instance: AxiosInstance

    constructor(config: RYRequestConfig) {
        // request实例 => axios实例
        this.instance = axios.create(config)

        // 每个instance实例都要有拦截器
        this.instance.interceptors.request.use(
            config => {
                return config
            },
            error => {
                return error
            }
        )
        this.instance.interceptors.response.use(
            res => res,
            error => error
        )
        // 针对特定的ryRequest实例添加拦截器
        this.instance.interceptors.request.use(
            config.interceptors?.requestSuccess as (
                value: InternalAxiosRequestConfig<any>
            ) => InternalAxiosRequestConfig<any>,
            config.interceptors?.requestFail as ((error: any) => any) | null | undefined
        )
        this.instance.interceptors.response.use(
            config.interceptors?.responseSuccess as
                | ((value: AxiosResponse<any>) => AxiosResponse<any>)
                | null
                | undefined,
            config.interceptors?.responseFail as ((error: any) => any) | null | undefined
        )
    }

    // 封装网络请求的方法
    request<T = any>(url: string, config: RYRequestConfig<T>) {
        if (config.interceptors?.requestSuccess) {
            // 单次请求的成功请求处理
            config = config.interceptors.requestSuccess(config)
        }
        return new Promise<T>((resolve, reject) => {
            this.instance
                .request<any, T>({ ...config, url })
                .then(res => {
                    // 单次响应成功的拦截器
                    if (config.interceptors?.responseSuccess) {
                        res = config.interceptors.responseSuccess(res)
                    }
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    get<T = any>(url: string, config: RYRequestConfig<T>) {
        return this.request(url, { ...config, method: 'GET' })
    }

    post<T = any>(url: string, config: RYRequestConfig<T>) {
        return this.request(url, { ...config, method: 'POST' })
    }
}

export default RYRequest
