import { ref } from 'vue'
import { pictureControllerGenerateImageV1, pictureControllerGetGenerateImageTaskV1 } from '@/api/picture'
import { message } from 'ant-design-vue'
export const useGenerateImageByAi = (setUrl: (url: string) => void) => {
    const taskId = ref('')
    const imageUrl = ref('')
    const text = ref('')
    const loading = ref(false)
    let pollingTimer: NodeJS.Timeout | null = null
    const clear = () => {
        if (pollingTimer) {
            clearInterval(pollingTimer)
            pollingTimer = null
            taskId.value = ''
        }
    }
    const handleGenerateImageTaskByAi = async () => {
        try {
            loading.value = true
            const res = await pictureControllerGetGenerateImageTaskV1({
                text: text.value
            })
            if (res.code === 1) {
                taskId.value = res.data.output.task_id
                startPolling()
            } else {
                loading.value = false
                clear()
            }
        } catch (error) {
            loading.value = false
            message.error('生成图片失败')
            clear()
        }
    }
    const startPolling = () => {
        pollingTimer = setInterval(async () => {
            try {
                const res = await pictureControllerGenerateImageV1({
                    taskId: taskId.value
                })
                if (res.code === 1) {
                    const taskOutput = res.data.output
                    if (taskOutput.task_status === 'SUCCEEDED') {
                        setUrl(taskOutput.results[0].url)
                        loading.value = false
                        message.success('生成成功')
                        clear()
                    }
                }
            } catch (error) {
                message.error('获取扩图任务失败')
                clear()
            }
        }, 3000)
    }

    return {
        handleGenerateImageTaskByAi,
        text,
        loading,
        imageUrl
    }
}
