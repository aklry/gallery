// client/src/hooks/useMessageStream.ts
import { onMounted, onUnmounted } from 'vue'
import { notification } from 'ant-design-vue'

export function useMessageStream() {
    let eventSource: EventSource | null = null

    onMounted(() => {
        eventSource = new EventSource(
            `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_API_BASE_URL}/message/stream`,
            {
                withCredentials: true // 携带 session cookie
            }
        )

        eventSource.addEventListener('message', e => {
            const data = JSON.parse(e.data)
            // 弹出通知
            notification.info({
                message: data.title,
                description: data.content,
                placement: 'topRight'
            })
            // 可以同时更新 store 中的未读计数
        })

        eventSource.onerror = () => {
            // 浏览器会自动重连，这里可以做日志
        }
    })

    onUnmounted(() => {
        eventSource?.close()
    })
}
