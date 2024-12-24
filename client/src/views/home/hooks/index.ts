import { ref, reactive, watch, onMounted } from 'vue'
import { pictureControllerGetPictureByPageVoV1, pictureControllerQueryPictureV1 } from '@/api/picture'
import { useRouter } from 'vue-router'
import { sessionCache } from '@/utils/cache'
import { message } from 'ant-design-vue'

const useHomeHooks = () => {
    const router = useRouter()
    const dataList = ref<API.ShowPictureModelVo[]>([])
    const total = ref<number>(0)
    const searchParams = reactive<API.QueryPictureDto>({
        current: '1',
        pageSize: '10',
        sortField: 'createTime',
        sortOrder: 'desc'
    })
    const loading = ref(false)
    const fetchData = async (current?: string) => {
        const loaded = sessionCache.getCache('loaded')
        try {
            loading.value = true
            if (current) {
                searchParams.current = current
            }
            const res = await pictureControllerGetPictureByPageVoV1(searchParams)
            if (dataList.value.length === 0 && !loaded) {
                if (res.data.list.length > 0) {
                    dataList.value = res.data.list
                } else {
                    sessionCache.setCache('loaded', false)
                    message.info('没有更多图片了')
                    loading.value = false
                }
            } else {
                if (res.data.list.length === 0) {
                    sessionCache.setCache('loaded', false)
                    message.info('没有更多图片了')
                    loading.value = false
                } else {
                    dataList.value = dataList.value?.concat(res.data.list)
                }
            }
            total.value = res.data.total
        } catch (error) {
            message.error('获取图片失败')
        } finally {
            if (!loaded) {
                loading.value = false
            }
        }
    }
    onMounted(() => {
        fetchData()
    })
    const changeTabs = (key: string) => {
        if (key === 'all') {
            searchParams.category = undefined
        } else {
            searchParams.category = key
        }
    }
    const changeTags = (tag: string, checked: boolean) => {
        if (!checked) {
            searchParams.tags = undefined
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
        console.log(value)
        queryPictureBySearchText({ searchText: value })
    }
    watch([() => searchParams.category, () => searchParams.tags], () => {
        fetchData()
    })
    return {
        dataList,
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
