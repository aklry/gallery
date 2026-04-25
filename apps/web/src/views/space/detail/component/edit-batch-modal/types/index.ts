export interface EditBatchProps {
    pictureList: API.ShowPictureModelVo[]
    onOk: (params: API.EditPictureByBatchDto, callback?: () => void) => void
}
