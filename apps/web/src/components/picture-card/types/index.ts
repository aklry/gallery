export interface PictureCardProps {
    picture: API.ShowPictureModelVo[]
    loading: boolean
    showEditAction?: boolean
    showDeleteAction?: boolean
}

export interface PictureCardEmits {
    previewPicture: [id: string]
    deletePicture: [id: string]
    editPicture: [id: string]
}
