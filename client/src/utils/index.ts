/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'

export const formatTime = (time?: string) => {
    if (!time) return '未知'
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export const formatSize = (size?: number) => {
    if (!size) return '未知'
    if (size < 1024) return size + 'B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB'
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
}

export const downloadPicture = (url?: string, filename?: string) => {
    if (!url) return
    saveAs(url, filename || 'picture.jpg')
}
/**
 * 将MB转为字节
 */
export const transformSize = (size?: number) => {
    if (!size) return
    return size * 1024 * 1024
}

/**
 *
 * @param{Function} fn - 回调的函数
 * @param{Number} delay - 持续的时间
 * @param{Boolean} immediately - 是否立即执行
 */
export const ryDebounce = (fn: Function, delay: number, immediately: boolean = false) => {
    //1.用于记录上一次事件触发的timer
    let timer: any = null
    //记录是否执行过
    let isInvoke = false
    //2.触发事件时执行的函数
    const _debounce = function (...args: any[]) {
        //2.1如果有再次触发(更多次触发)事件，那么取消上一次的事件
        return new Promise((resolve, reject) => {
            try {
                if (timer) clearTimeout(timer)
                let res = undefined
                //第一次操作，不需要延迟操作
                if (immediately && !isInvoke) {
                    // @ts-ignore
                    res = fn.apply(this, args)
                    resolve(res)
                    isInvoke = true
                    return
                }
                //1.2延迟执行对应的fn函数(传入的回调函数)
                timer = setTimeout(() => {
                    // @ts-ignore
                    res = fn.apply(this, args)
                    resolve(res)
                    timer = null //执行过函数之后，将timer重新重置为null
                    isInvoke = false
                }, delay)
            } catch (e) {
                reject(e)
            }
        })
    }
    //返回一个新的函数
    //3.给_debounce绑定一个取消的函数
    _debounce.cancel = function () {
        if (timer) clearTimeout(timer)
        timer = null
        isInvoke = false
    }
    return _debounce
}

/**
 *
 * @param fn - 要执行的函数
 * @param interval
 * @param leading - 是否立即执行
 * @param trailing - 是否尾部执行
 * @returns {function(...[*]=): Promise<unknown>}
 */
export const ryThrottle = (fn: Function, interval: number, { leading = true, trailing = false } = {}) => {
    let startTime = 0
    let timer: any = null
    const _throttle = function (...args: any[]) {
        return new Promise((resolve, reject) => {
            try {
                //1.获取当前时间
                const nowTime = new Date().getTime()
                let res = undefined
                //2.对立即执行进行控制
                if (!leading && startTime === 0) {
                    startTime = nowTime
                }
                //3.计算需要等待的时间来执行函数
                const waitTime = interval - (nowTime - startTime)
                if (waitTime <= 0) {
                    if (timer) clearTimeout(timer)
                    // @ts-ignore
                    res = fn.apply(this, args)
                    resolve(res)
                    startTime = nowTime
                    timer = null
                    return
                }
                //3.判断是否需要执行尾部
                if (trailing && !timer) {
                    timer = setTimeout(() => {
                        // @ts-ignore
                        res = fn.apply(this, args)
                        resolve(res)
                        startTime = new Date().getTime()
                        timer = null
                    }, waitTime)
                }
            } catch (e) {
                reject(e)
            }
        })
    }
    _throttle.cancel = function () {
        if (timer) clearTimeout(timer)
        startTime = 0
        timer = null
    }
    return _throttle
}
