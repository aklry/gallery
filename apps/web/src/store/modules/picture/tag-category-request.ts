import { TagCategory } from './type'

export interface TagCategoryRequestResponse {
    data?: {
        tagList?: string[]
        categoryList?: string[]
    }
}

export interface TagCategoryRequestState {
    value: TagCategory
    loaded: boolean
}

export const normalizeTagCategory = (response: TagCategoryRequestResponse): TagCategory => {
    const tagList = response.data?.tagList?.map(item => ({ value: item })) ?? []
    const categoryList = response.data?.categoryList?.map(item => ({ value: item })) ?? []

    return { tagList, categoryList }
}

export const createTagCategoryRequestController = (
    requestTagCategory: () => Promise<TagCategoryRequestResponse>,
    state: TagCategoryRequestState,
    onError?: (error: unknown) => void
) => {
    let pending: Promise<void> | null = null

    return async (force = false) => {
        if (!force && state.loaded) {
            return
        }
        if (pending) {
            return pending
        }

        if (force) {
            state.loaded = false
        }

        pending = requestTagCategory()
            .then(response => {
                state.value = normalizeTagCategory(response)
                state.loaded = true
            })
            .catch(error => {
                state.loaded = false
                onError?.(error)
            })
            .finally(() => {
                pending = null
            })

        return pending
    }
}
