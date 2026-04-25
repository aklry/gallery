import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    pictureControllerGetPictureByPageVoV1,
    pictureControllerQueryPictureV1,
    pictureControllerRecommendPicturesV1
} from '@/api/picture'
import { message } from 'ant-design-vue'

const useHomeHooks = (containerRef: Ref<HTMLDivElement | null>, sentinelRef: Ref<HTMLDivElement | null>) => {
    const router = useRouter()
    const dataList = ref<API.ShowPictureModelVo[]>([])
    const total = ref<number>(0)
    const hasUserScrolled = ref(false)
    const searchParams = reactive<API.QueryPictureDto>({
        current: '1',
        pageSize: '20',
        sortField: 'createTime',
        sortOrder: 'desc'
    })
    const loading = ref(false)
    const noMore = ref(false)
    let isLoadingMore = false
    let observer: IntersectionObserver | null = null
    let lastSentinelEl: HTMLDivElement | null = null

    const fetchData = async (current?: string) => {
        if (isLoadingMore) return
        isLoadingMore = true
        loading.value = true
        try {
            if (current) {
                searchParams.current = current
            }
            const res = await pictureControllerRecommendPicturesV1({
                current: searchParams.current,
                pageSize: searchParams.pageSize,
                scene: 'home'
            })
            if (res.data.list.length === 0) {
                noMore.value = true
            } else if (dataList.value.length === 0 || current === '1') {
                dataList.value = res.data.list
            } else {
                dataList.value = dataList.value.concat(res.data.list)
            }
            total.value = res.data.total
            noMore.value = dataList.value.length >= res.data.total
        } catch (error) {
            message.error('获取图片失败')
        } finally {
            loading.value = false
            isLoadingMore = false
        }
    }

    const fetchDataByClassify = async (category?: string, tags?: string[]) => {
        loading.value = true
        try {
            const res = await pictureControllerGetPictureByPageVoV1({
                ...searchParams,
                category,
                tags
            })
            dataList.value = res.data.list
            total.value = res.data.total
            noMore.value = dataList.value.length >= res.data.total
        } finally {
            loading.value = false
        }
    }

    const resetAndFetch = () => {
        searchParams.current = '1'
        noMore.value = false
        hasUserScrolled.value = false
    }

    const changeTabs = (key: string) => {
        resetAndFetch()
        if (key === 'all') {
            searchParams.category = undefined
        } else {
            searchParams.category = key
        }
    }

    const changeTags = (tag: string, checked: boolean) => {
        resetAndFetch()
        if (!checked) {
            searchParams.tags = undefined
        } else {
            searchParams.tags = [tag]
        }
    }

    const clickPicture = (id: string) => {
        void router.push(`/picture/${id}`)
    }

    const queryPictureBySearchText = async (queryPictureDto: Partial<API.QueryPictureDto>) => {
        loading.value = true
        try {
            const res = await pictureControllerQueryPictureV1(queryPictureDto)
            dataList.value = res.data.list
            total.value = res.data.total
            noMore.value = dataList.value.length >= res.data.total
        } finally {
            loading.value = false
        }
    }

    const handleSearchPicture = (value: string) => {
        searchParams.searchText = value || undefined
        hasUserScrolled.value = false
        if (!value) {
            resetAndFetch()
            void fetchData('1')
            return
        }
        queryPictureBySearchText({ searchText: value })
    }

    const handleContainerScroll = () => {
        if (!containerRef.value) return
        if (containerRef.value.scrollTop > 0) {
            hasUserScrolled.value = true
        }
    }

    const loadMore = () => {
        if (isLoadingMore || noMore.value) return
        const newPage = (parseInt(searchParams.current as string, 10) + 1).toString()
        fetchData(newPage)
    }

    const setupObserver = () => {
        // 只在 sentinel 元素真正变化时才重建 observer，避免重复触发
        if (sentinelRef.value === lastSentinelEl && observer) return

        if (observer) observer.disconnect()
        if (!sentinelRef.value || !containerRef.value) return

        lastSentinelEl = sentinelRef.value

        observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasUserScrolled.value && !isLoadingMore && !noMore.value) {
                    loadMore()
                }
            },
            {
                root: containerRef.value,
                rootMargin: '0px 0px 200px 0px',
                threshold: 0
            }
        )
        observer.observe(sentinelRef.value)
    }

    onMounted(async () => {
        await fetchData()
        await nextTick()
        containerRef.value?.addEventListener('scroll', handleContainerScroll)
        setupObserver()
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
        }
    })

    // 数据变化后重新挂载 observer（sentinel 可能因 v-if 重新渲染）
    watch(dataList, async () => {
        await nextTick()
        setupObserver()
    })

    onBeforeUnmount(() => {
        containerRef.value?.removeEventListener('scroll', handleContainerScroll)
        if (observer) {
            observer.disconnect()
            observer = null
        }
    })

    return {
        dataList,
        containerRef,
        total,
        searchParams,
        loading,
        noMore,
        changeTabs,
        changeTags,
        clickPicture,
        fetchData,
        handleSearchPicture
    }
}
export default useHomeHooks
