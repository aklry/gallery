import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import { MessageType, MessageTypeTextMap } from '@/constants'

type StreamMessagePayload = {
    id: string
    title: string
    content: string
    messageType?: string
    result?: number
    spaceId?: string
    actionUrl?: string
}

export function useMessageStream() {
    const router = useRouter()
    let eventSource: EventSource | null = null

    onMounted(() => {
        eventSource = new EventSource(
            `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_API_BASE_URL}/message/stream`,
            {
                withCredentials: true
            }
        )

        eventSource.addEventListener('message', e => {
            const data = JSON.parse(e.data) as StreamMessagePayload
            const messageType = data.messageType as MessageType | undefined

            notification.info({
                message: messageType ? MessageTypeTextMap[messageType] : data.title || '新消息',
                description: data.content,
                placement: 'topRight',
                onClick: async () => {
                    if (data.actionUrl) {
                        await router.push(data.actionUrl)
                        return
                    }
                    await router.push('/user/message')
                }
            })
        })
    })

    onUnmounted(() => {
        eventSource?.close()
    })
}
