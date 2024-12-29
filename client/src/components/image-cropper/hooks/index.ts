import { message } from 'ant-design-vue'
import { useTemplateRef } from 'vue'
import { VueCropper } from 'vue-cropper'
import { pictureControllerUploadFileV1 } from '@/api/picture'
import { ImageCropperProps } from '../types'

export const useImageCropper = (props: ImageCropperProps) => {
    const cropper = useTemplateRef<typeof VueCropper>('cropper')

    const handleRotateLeft = () => {
        cropper.value?.rotateLeft()
    }
    const handleRotateRight = () => {
        cropper.value?.rotateRight()
    }
    const handleZoomOut = () => {
        cropper.value?.changeScale(1)
    }
    const handleZoomIn = () => {
        cropper.value?.changeScale(-1)
    }
    const handleUploadPicture = async ({ file }: { file: File }) => {
        try {
            const params: any = props.picture ? { id: props.picture.id } : {}
            params.spaceId = props.spaceId
            const res = await pictureControllerUploadFileV1(params, file)
            if (res.code === 1) {
                message.success('上传成功')
                props.onSuccess?.(res.data)
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('上传失败')
        }
    }
    const handleSaveCropPicture = () => {
        cropper.value?.getCropBlob((blob: Blob) => {
            const ext = ['.png', '.jpg', '.webp', '.jpeg']
            const name = props.picture?.filename
            const filename = ext.some(extension => name?.endsWith(extension)) ? name : `${name}${props.picture?.format}`
            const file = new File([blob], filename as string, { type: blob.type })
            handleUploadPicture({ file })
        })
    }
    return { handleRotateLeft, handleRotateRight, handleZoomIn, handleZoomOut, handleSaveCropPicture }
}
