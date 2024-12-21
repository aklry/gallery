import { ref, reactive, onMounted, watch } from 'vue'
import { pictureControllerGetPictureByPageVoV1 } from '@/api/picture'
import { useRouter } from 'vue-router'

const useHomeHooks = () => {
    const router = useRouter()
    const dataList = ref<API.ShowPictureModelVo[]>()
    const total = ref<number>(0)
    const searchParams = reactive<API.QueryPictureDto>({
        current: '1',
        pageSize: '10',
        sortField: 'createTime',
        sortOrder: 'desc'
    })
    const fetchData = async () => {
        const res = await pictureControllerGetPictureByPageVoV1(searchParams)
        dataList.value = res.data.list
        total.value = res.data.total
    }
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
    onMounted(() => {
        fetchData()
    })
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
        changeTabs,
        changeTags,
        clickPicture,
        handleSearchPicture
    }
}
export default useHomeHooks
