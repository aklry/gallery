import { ref, reactive, watch, onMounted } from 'vue'
import { pictureControllerGetPictureByPageVoV1 } from '@/api/picture'
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
        loading.value = true
        if (current) {
            searchParams.current = current
        }
        const loaded = sessionCache.getCache('loaded')
        const res = await pictureControllerGetPictureByPageVoV1(searchParams)
        if (dataList.value.length === 0 && !loaded) {
            dataList.value = res.data.list
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
    const handleSearchPicture = (value: string) => {
        if (!value) {
            searchParams.searchText = undefined
        } else {
            searchParams.searchText = value
        }
        fetchData()
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
