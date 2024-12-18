import { computed, ref, watchEffect } from 'vue'
import {
    messageControllerFindAllHistoryMessage,
    messageControllerFindAllNewMessage,
    messageControllerReadMessage
} from '@/api/message'
import { MessageStatus } from '@/constants'
const useMessage = () => {
    const newMessageList = ref<API.MessageVoModel[]>()
    const newMessageTotal = ref<number>(0)
    const historyMessageList = ref<API.MessageVoModel[]>()
    const historyMessageTotal = ref<number>(0)
    const currentKey = ref<string>('1')
    const getNewMessageList = async () => {
        const res = await messageControllerFindAllNewMessage()
        newMessageList.value = res.data.list
        newMessageTotal.value = res.data.total
    }

    const getHistoryMessageList = async () => {
        const res = await messageControllerFindAllHistoryMessage()
        historyMessageList.value = res.data.list
        historyMessageTotal.value = res.data.total
    }

    const historyMessageHasRead = computed(() => {
        const hasRead = historyMessageList.value?.some(item => item.hasRead === MessageStatus.UNREAD)
        return hasRead
    })

    const newHistoryMessageHasRead = computed(() =>
        newMessageList.value?.some(item => item.hasRead === MessageStatus.UNREAD)
    )

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
        await messageControllerReadMessage({
            id: item.id
        })
        if (currentKey.value === '1') {
            getNewMessageList()
        } else {
            getHistoryMessageList()
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
        historyMessageHasRead,
        newHistoryMessageHasRead,
        currentKey,
        currentMessageList,
        handleMessageClick
    }
}

export default useMessage
