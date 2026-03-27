export interface PictureCardProps {
    picture: API.ShowPictureModelVo[]
    loading: boolean
}

export interface PictureCardEmits {
    previewPicture: [id: string]
    deletePicture: [id: string]
    editPicture: [id: string]
}
