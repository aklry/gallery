export interface PictureCardProps {
    picture: API.ShowPictureModelVo[]
    loading: boolean
    spaceId?: string
}

export interface PictureCardEmits {
    deletePicture: [id: string]
    editPicture: [id: string]
}
