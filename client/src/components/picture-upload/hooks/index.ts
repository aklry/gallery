import { ref } from 'vue'
import { message, UploadProps } from 'ant-design-vue'
import { pictureControllerUploadFileV1 } from '@/api/picture'
import { userControllerUploadUserAvatarV1 } from '@/api/user'
import { PictureUploadProps } from '../types'

const usePictureUpload = (props: PictureUploadProps) => {
    const loading = ref<boolean>(false)
    const fileList = ref<any>([])
    const uploadCustomRequest = async () => {
        loading.value = true
        try {
            let res: API.UploadAvatarVo | API.UploadPictureVo
            const params: any = {}
            if (props.picture && 'id' in props.picture) {
                params.id = props.picture.id
            }
            if (props.spaceId) {
                params.spaceId = props.spaceId
            }
            if (props.prefix) {
                res = await userControllerUploadUserAvatarV1({ prefix: props.prefix }, fileList.value[0].originFileObj)
            } else {
                res = await pictureControllerUploadFileV1(params, fileList.value[0].originFileObj)
            }
            if (res.code === 1) {
                if (props.prefix) {
                    props?.onUploadAvatarSuccess?.(res.data)
                } else {
                    props?.onUploadPictureSuccess?.(res.data as API.UploadPictureVoModel)
                }
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('上传失败')
        } finally {
            loading.value = false
        }
    }
    // @ts-ignore
    const handleBeforeUpload = (file: UploadProps['fileList'][number]) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            message.error('格式不对')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('图片不能大于2M')
        }
        return isJpgOrPng && isLt2M
    }
    return {
        loading,
        fileList,
        uploadCustomRequest,
        handleBeforeUpload
    }
}

export default usePictureUpload
