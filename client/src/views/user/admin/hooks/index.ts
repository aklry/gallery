import { onMounted, reactive, ref } from 'vue'
import { userControllerDeleteUserV1, userControllerGetUserByPageV1 } from '@/api/user'
import { Modal, message } from 'ant-design-vue'
const useAdmin = () => {
    const searchParams = reactive<API.FindUserDto>({
        current: '1',
        pageSize: '10'
    })
    const dataSource = ref<API.UserVoModel[]>([])
    const total = ref(0)
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
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: '确定要删除吗？',
            content: '删除后将无法恢复',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                try {
                    const res = await userControllerDeleteUserV1({
                        id
                    })
                    if (res.code === 1) {
                        message.success('删除成功')
                        await fetchData()
                    }
                } catch (error) {
                    message.error('删除失败')
                }
            }
        })
    }
    const columns = ref<any[]>([
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName'
        },
        {
            title: '用户账号',
            dataIndex: 'userAccount',
            key: 'userAccount'
        },
        {
            title: '用户角色',
            dataIndex: 'userRole',
            key: 'userRole'
        },
        {
            title: '用户头像',
            dataIndex: 'userAvatar',
            key: 'userAvatar',
            width: '100px'
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
            fixed: 'right'
        }
    ])
    const fetchData = async () => {
        try {
            const res = await userControllerGetUserByPageV1(searchParams)
            if (res.code === 1) {
                dataSource.value = res.data.list
                total.value = res.data.total
            }
        } catch (error) {
            message.error('获取用户数据失败')
        }
    }
    const handlePageChange = (page: number, pageSize: number) => {
        searchParams.current = page.toString()
        searchParams.pageSize = pageSize.toString()
        fetchData()
    }
    onMounted(async () => {
        await fetchData()
    })
    return {
        columns,
        dataSource,
        total,
        searchParams,
        handleChange,
        handleDelete,
        handlePageChange
    }
}

export default useAdmin
