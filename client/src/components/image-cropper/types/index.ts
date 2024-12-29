export interface ImageCropperProps {
    imageUrl: string
    picture?: API.UploadPictureVoModel
    spaceId?: string
    onSuccess?: (newPicture: API.UploadPictureVoModel) => void
}
