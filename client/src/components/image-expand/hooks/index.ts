import { ref, toRefs } from 'vue'
import { ImageExpandProps } from '../types'
import { pictureControllerCreateAiExpandPictureTaskV1, pictureControllerGetAiExpandPictureTaskV1 } from '@/api/picture'
import { message } from 'ant-design-vue'

export const useImageExpand = (props: ImageExpandProps) => {
    const resultImageUrl = ref('')
    const loading = ref(false)
    const taskId = ref('')
    const { picture } = toRefs(props)
    let pollingTimer: NodeJS.Timeout | null = null
    const startPolling = () => {
        const clear = () => {
            if (pollingTimer) {
                clearInterval(pollingTimer)
                pollingTimer = null
                taskId.value = ''
            }
        }
        pollingTimer = setInterval(async () => {
            try {
                const res = await pictureControllerGetAiExpandPictureTaskV1({
                    taskId: taskId.value
                })
                if (res.code === 1) {
                    const taskOutput = res.data.output
                    if (taskOutput.task_status === 'SUCCEEDED') {
                        message.success('扩图任务成功')
                        resultImageUrl.value = taskOutput.output_image_url as string
                        clear()
                    } else if (taskOutput.task_status === 'FAILED') {
                        message.error('扩图任务失败')
                        clear()
                    }
                }
            } catch (error) {
                message.error('获取扩图任务失败')
                clear()
            }
        }, 3000)
    }
    const handleApply = () => {
        props.onSuccess?.(resultImageUrl.value)
    }
    const handleGenerate = async () => {
        loading.value = true
        try {
            if (!picture?.value?.id) return
            const res = await pictureControllerCreateAiExpandPictureTaskV1({
                pictureId: picture?.value?.id,
                aiExpandPictureCreateDto: {
                    url: picture?.value?.url,
                    xScale: 2,
                    yScale: 2
                }
            })
            if (res.code === 1) {
                message.success('生成中,请耐心等待')
                taskId.value = res.data.output.task_id
                startPolling()
            }
        } catch (error) {
            message.error('生成失败')
        } finally {
            loading.value = false
        }
    }

    return {
        resultImageUrl,
        handleGenerate,
        handleApply,
        loading
    }
}
