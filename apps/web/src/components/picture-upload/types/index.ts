export interface PictureUploadProps {
    onUploadPictureSuccess?: (result: API.UploadPictureVoModel) => void
    onUploadAvatarSuccess?: (result: API.UploadAvatarVoModel) => void
    picture?: API.UploadPictureVoModel | API.UploadAvatarVoModel
    prefix?: string
    spaceId?: string
}
