import { computed, ref, watchEffect } from 'vue'
import {
    messageControllerFindAllHistoryMessageV1,
    messageControllerFindAllNewMessageV1,
    messageControllerReadMessageV1,
    messageControllerReadAllMessageV1
} from '@/api/message'
import { MessageStatus } from '@/constants'
import { message } from 'ant-design-vue'
const useMessage = () => {
    const newMessageList = ref<API.MessageVoModel[]>()
    const newMessageTotal = ref<number>(0)
    const historyMessageList = ref<API.MessageVoModel[]>()
    const historyMessageTotal = ref<number>(0)
    const currentKey = ref<string>('1')
    const loading = ref(false)
    const readAllLoading = ref(false)

    const getNewMessageList = async () => {
        loading.value = true
        try {
            const res = await messageControllerFindAllNewMessageV1({})
            newMessageList.value = res.data.list
            newMessageTotal.value = res.data.total
        } finally {
            loading.value = false
        }
    }

    const getHistoryMessageList = async () => {
        loading.value = true
        try {
            const res = await messageControllerFindAllHistoryMessageV1({})
            historyMessageList.value = res.data.list
            historyMessageTotal.value = res.data.total
        } finally {
            loading.value = false
        }
    }

    const newUnreadCount = computed(
        () => newMessageList.value?.filter(item => item.hasRead === MessageStatus.UNREAD).length ?? 0
    )

    const historyUnreadCount = computed(
        () => historyMessageList.value?.filter(item => item.hasRead === MessageStatus.UNREAD).length ?? 0
    )

    const hasUnread = computed(() => {
        if (currentKey.value === '1') {
            return newUnreadCount.value > 0
        }
        return historyUnreadCount.value > 0
    })

    const currentMessageList = computed(() => {
        if (currentKey.value === '1') {
            return newMessageList.value
        } else {
            return historyMessageList.value
        }
    })

    const handleMessageClick = async (item: API.MessageVoModel) => {
        if (item.hasRead === MessageStatus.READ) {
            return
        }
        await messageControllerReadMessageV1({
            id: item.id
        })
        if (currentKey.value === '1') {
            getNewMessageList()
        } else {
            getHistoryMessageList()
        }
    }

    const handleReadAllMessage = async () => {
        readAllLoading.value = true
        try {
            await messageControllerReadAllMessageV1()
            message.success('已全部标记为已读')
            if (currentKey.value === '1') {
                getNewMessageList()
            } else {
                getHistoryMessageList()
            }
        } catch (error) {
            message.error('全部已读失败')
        } finally {
            readAllLoading.value = false
        }
    }

    watchEffect(() => {
        if (currentKey.value === '1') {
            getNewMessageList()
        } else {
            getHistoryMessageList()
        }
    })
    return {
        newMessageList,
        newMessageTotal,
        historyMessageList,
        historyMessageTotal,
        newUnreadCount,
        historyUnreadCount,
        hasUnread,
        loading,
        readAllLoading,
        currentKey,
        currentMessageList,
        handleMessageClick,
        handleReadAllMessage
    }
}

export default useMessage
