import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { pictureControllerGetPictureByPageVoV1, pictureControllerQueryPictureV1 } from '@/api/picture'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { debounce } from 'lodash'

const useHomeHooks = () => {
    const router = useRouter()
    const dataList = ref<API.ShowPictureModelVo[]>([])
    const containerRef = ref<HTMLDivElement | null>(null)
    const total = ref<number>(0)
    let flag1 = true
    let flag2 = true
    const searchParams = reactive<API.QueryPictureDto>({
        current: '1',
        pageSize: '20',
        sortField: 'createTime',
        sortOrder: 'desc'
    })
    const loading = ref(false)
    const fetchData = async (current?: string) => {
        try {
            if (current) {
                searchParams.current = current
            }
            const res = await pictureControllerGetPictureByPageVoV1(searchParams)
            if (dataList.value.length === 0) {
                if (res.data.list.length > 0) {
                    dataList.value = res.data.list
                } else {
                    message.info('没有更多图片了')
                    loading.value = false
                }
            } else {
                if (res.data.list.length === 0) {
                    message.info('没有更多图片了')
                    loading.value = false
                } else {
                    dataList.value = dataList.value?.concat(res.data.list)
                }
            }
            total.value = res.data.total
        } catch (error) {
            message.error('获取图片失败')
            loading.value = false
        }
    }
    const fetchDataByClassify = async (category?: string, tags?: string[]) => {
        const res = await pictureControllerGetPictureByPageVoV1({
            ...searchParams,
            category,
            tags
        })
        dataList.value = res.data.list
        total.value = res.data.total
    }
    const changeTabs = (key: string) => {
        searchParams.current = '1'
        if (flag1) {
            if (loading.value) {
                loading.value = false
            }
            flag1 = false
        }
        if (key === 'all') {
            searchParams.category = undefined
            loading.value = true
        } else {
            searchParams.category = key
        }
    }
    const changeTags = (tag: string, checked: boolean) => {
        searchParams.current = '1'
        if (flag2) {
            if (loading.value) {
                loading.value = false
            }
            flag2 = false
        }
        if (!checked) {
            searchParams.tags = undefined
            loading.value = true
        } else {
            searchParams.tags = [tag]
        }
    }
    const clickPicture = (id: string) => {
        router.push({
            path: `/picture/${id}`
        })
    }
    const queryPictureBySearchText = async (queryPictureDto: Partial<API.QueryPictureDto>) => {
        const res = await pictureControllerQueryPictureV1(queryPictureDto)
        dataList.value = res.data.list
        total.value = res.data.total
    }
    const handleSearchPicture = (value: string) => {
        if (!value) {
            searchParams.searchText = undefined
        } else {
            searchParams.searchText = value
        }
        queryPictureBySearchText({ searchText: value })
    }
    onMounted(() => {
        fetchData()
    })
    watch([() => searchParams.category, () => searchParams.tags], ([category, tags]) => {
        if (category) {
            fetchDataByClassify(category)
            return
        }
        if (tags) {
            fetchDataByClassify(undefined, tags)
            return
        }
        if (category === undefined || tags === undefined) {
            fetchData('1')
            return
        }
    })
    const handleScroll = debounce((e: Event) => {
        const target = e.target as HTMLElement
        const { scrollTop, clientHeight, scrollHeight } = target
        const nearBottom = scrollHeight - (scrollTop + clientHeight) <= 100
        loading.value = nearBottom
        const hasMore = dataList.value.length < total.value
        if (!nearBottom || !hasMore || !loading.value) return

        const newPage = (parseInt(searchParams.current as string, 10) + 1).toString()
        fetchData(newPage)
    }, 100)

    onMounted(() => {
        if (containerRef.value) {
            containerRef.value.addEventListener('scroll', handleScroll)
        }
    })

    onBeforeUnmount(() => {
        if (containerRef.value) {
            containerRef.value.removeEventListener('scroll', handleScroll)
        }
    })
    return {
        dataList,
        containerRef,
        total,
        searchParams,
        loading,
        changeTabs,
        changeTags,
        clickPicture,
        fetchData,
        handleSearchPicture
    }
}
export default useHomeHooks
