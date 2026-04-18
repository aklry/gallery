import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
    messageControllerFindAllHistoryMessageV1,
    messageControllerFindAllNewMessageV1,
    messageControllerReadAllMessageV1,
    messageControllerReadMessageV1
} from '@/api/message'
import { MessageStatus } from '@/constants'

export type MessageItem = API.MessageVoModel & {
    messageType?: string
    result?: number
    bizId?: string
    spaceId?: string
    actionUrl?: string
    extra?: string
}

const useMessage = () => {
    const router = useRouter()
    const newMessageList = ref<MessageItem[]>([])
    const historyMessageList = ref<MessageItem[]>([])
    const currentKey = ref('1')
    const loading = ref(false)
    const readAllLoading = ref(false)

    const getNewMessageList = async () => {
        loading.value = true
        try {
            const res = await messageControllerFindAllNewMessageV1({})
            newMessageList.value = (res.data?.list ?? []) as MessageItem[]
        } catch (error) {
            message.error('获取最新消息失败')
        } finally {
            loading.value = false
        }
    }

    const getHistoryMessageList = async () => {
        loading.value = true
        try {
            const res = await messageControllerFindAllHistoryMessageV1({})
            historyMessageList.value = (res.data?.list ?? []) as MessageItem[]
        } catch (error) {
            message.error('获取历史消息失败')
        } finally {
            loading.value = false
        }
    }

    const refreshCurrentList = async () => {
        if (currentKey.value === '1') {
            await getNewMessageList()
            return
        }
        await getHistoryMessageList()
    }

    const refreshAllList = async () => {
        await Promise.all([getNewMessageList(), getHistoryMessageList()])
    }

    const newUnreadCount = computed(
        () => newMessageList.value.filter(item => item.hasRead === MessageStatus.UNREAD).length
    )

    const historyUnreadCount = computed(
        () => historyMessageList.value.filter(item => item.hasRead === MessageStatus.UNREAD).length
    )

    const hasUnread = computed(() => {
        const currentList = currentKey.value === '1' ? newMessageList.value : historyMessageList.value
        return currentList.some(item => item.hasRead === MessageStatus.UNREAD)
    })

    const currentMessageList = computed(() => {
        return currentKey.value === '1' ? newMessageList.value : historyMessageList.value
    })

    const jumpByMessage = async (item: MessageItem) => {
        if (item.actionUrl) {
            await router.push(item.actionUrl)
        }
    }

    const handleMessageClick = async (item: MessageItem) => {
        try {
            if (item.hasRead === MessageStatus.UNREAD) {
                await messageControllerReadMessageV1({
                    id: item.id
                })
                await refreshAllList()
            }
            await jumpByMessage(item)
        } catch (error) {
            message.error('处理消息失败')
        }
    }

    const handleReadAllMessage = async () => {
        readAllLoading.value = true
        try {
            await messageControllerReadAllMessageV1()
            message.success('已全部标记为已读')
            await refreshAllList()
        } catch (error) {
            message.error('全部已读失败')
        } finally {
            readAllLoading.value = false
        }
    }

    watch(
        currentKey,
        async () => {
            await refreshCurrentList()
        },
        {
            immediate: true
        }
    )

    return {
        currentKey,
        currentMessageList,
        loading,
        readAllLoading,
        hasUnread,
        newUnreadCount,
        historyUnreadCount,
        handleMessageClick,
        handleReadAllMessage
    }
}

export default useMessage
