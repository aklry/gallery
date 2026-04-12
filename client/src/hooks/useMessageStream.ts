// client/src/hooks/useMessageStream.ts
import { onMounted, onUnmounted } from 'vue'
import { notification } from 'ant-design-vue'
import { messageControllerReadMessageV1 } from '@/api/message'

export function useMessageStream() {
    let eventSource: EventSource | null = null

    onMounted(() => {
        eventSource = new EventSource(
            `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_API_BASE_URL}/message/stream`,
            {
                withCredentials: true // 携带 session cookie
            }
        )

        eventSource.addEventListener('message', async e => {
            const data = JSON.parse(e.data)
            // 弹出通知
            notification.info({
                message: data.title,
                description: data.content,
                placement: 'topRight'
            })
            // 更新消息状态为已读
            await messageControllerReadMessageV1({
                id: data.id
            })
        })
    })

    onUnmounted(() => {
        eventSource?.close()
    })
}
