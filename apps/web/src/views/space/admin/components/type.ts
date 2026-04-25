export interface EditDialogProps {
    editRecord?: API.UpdateSpaceDto
    confirm?: (updateSpaceDto: API.UpdateSpaceDto) => void
}
export interface QueryFormProps {
    searchParams?: API.QuerySpaceDto
    query?: (queryParams: API.QuerySpaceDto) => void
}
