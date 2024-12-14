import { ref, reactive, onMounted } from 'vue'
import { pictureControllerDeletePictureV1, pictureControllerGetPictureByPageV1 } from '@/api/picture'
import { message, Modal, TableColumnProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
const usePictureHooks = () => {
    const router = useRouter()
    const searchParams = reactive<API.QueryPictureDto>({
        current: '1',
        pageSize: '10',
        sortField: 'createTime',
        sortOrder: 'desc'
    })
    const dataSource = ref<API.PictureVoModel[]>([])
    const total = ref(0)
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
                const res = await pictureControllerDeletePictureV1({ id })
                if (res.code === 1) {
                    message.success('删除成功')
                    fetchData()
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
        handleDelete
    }
}

export default usePictureHooks
