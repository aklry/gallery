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
