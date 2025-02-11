import { ref, reactive, onMounted } from 'vue'
import {
    pictureControllerDeletePictureV1,
    pictureControllerGetPictureByPageV1,
    pictureControllerReviewPictureV1
} from '@/api/picture'
import { message, Modal, TableColumnProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { ReviewMessage, ReviewStatus } from '@/constants'
const usePictureHooks = () => {
    const router = useRouter()
    const searchParams = reactive<API.QueryPictureDto>({
        current: '1',
        pageSize: '10',
        sortField: 'createTime',
        sortOrder: 'desc',
        nullSpaceId: true
    })
    const dataSource = ref<API.PictureVoModel[]>([])
    const total = ref(0)
    const pictureId = ref('')
    const openMessageModal = ref(false)
    const messageContent = ref('')
    const handleSearch = async () => {
        const res = await pictureControllerGetPictureByPageV1(searchParams)
        dataSource.value = res.data.list
        total.value = res.data.total
    }
    const fetchData = async () => {
        const res = await pictureControllerGetPictureByPageV1(searchParams)
        dataSource.value = res.data.list
        total.value = res.data.total
    }
    const handleChange = async (pagination: any, _filters: any, sorter: any) => {
        const { current, pageSize } = pagination
        const { field, order } = sorter
        searchParams.current = current.toString()
        searchParams.pageSize = pageSize.toString()
        if (field && order) {
            searchParams.sortField = field
            searchParams.sortOrder = order.replace('end', '')
        }
        await fetchData()
    }
    const handleEdit = (id: string) => {
        router.push({
            path: `/picture/add`,
            query: {
                id
            }
        })
    }
    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: '确定要删除吗？',
            content: '删除后将无法恢复',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const res = await pictureControllerDeletePictureV1({ id })
                    if (res.code === 1) {
                        message.success('删除成功')
                        fetchData()
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('删除失败')
                }
            }
        })
    }
    const columns = ref<TableColumnProps[]>([
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },
        {
            title: '图片',
            dataIndex: 'url',
            key: 'url'
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 240
        },
        {
            title: '图片信息',
            key: 'pictureInfo',
            dataIndex: 'pictureInfo',
            slots: { customRender: 'pictureInfo' }
        },
        {
            title: '简介',
            dataIndex: 'introduction',
            key: 'introduction'
        },
        {
            title: '类型',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: '标签',
            dataIndex: 'tags',
            key: 'tags'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 200
        }
    ])
    const handleReview = async (id: string, status: ReviewStatus, info?: string) => {
        pictureId.value = id
        if (status === ReviewStatus.REJECT) {
            openMessageModal.value = true
            return
        }
        try {
            await pictureControllerReviewPictureV1({
                id,
                reviewStatus: status,
                reviewMessage: info ?? ReviewMessage[status]
            })
            message.success(status === ReviewStatus.PASS ? '审核通过' : '成功拒绝')
            fetchData()
        } catch (error) {
            message.error('审核失败')
        }
    }

    const handleReject = async () => {
        await pictureControllerReviewPictureV1({
            id: pictureId.value,
            reviewStatus: ReviewStatus.REJECT,
            reviewMessage: messageContent.value
        })
        message.success('拒绝成功')
        fetchData()
    }

    const handleMessageOk = async () => {
        await handleReject()
        openMessageModal.value = false
        messageContent.value = ''
    }

    const goToBatchAddPicture = () => {
        router.push('/picture/add/batch')
    }

    onMounted(() => {
        fetchData()
    })
    return {
        dataSource,
        columns,
        total,
        handleChange,
        handleSearch,
        searchParams,
        handleEdit,
        handleDelete,
        handleReview,
        openMessageModal,
        messageContent,
        handleMessageOk,
        goToBatchAddPicture
    }
}

export default usePictureHooks
