import { spaceControllerDeleteSpaceV1, spaceControllerListSpaceV1, spaceControllerUpdateSpaceV1 } from '@/api/space'
import { transformSize } from '@/utils'
import { message, Modal, TableColumnProps } from 'ant-design-vue'
import { reactive, ref, watchEffect } from 'vue'

const useSpaceAdminHooks = () => {
    const searchParams = reactive<API.QuerySpaceDto>({
        current: '1',
        pageSize: '10'
    })
    const spaceList = ref<API.SpaceModelVo[]>([])
    const total = ref<number>(0)
    const fetchSpaceList = async () => {
        try {
            const res = await spaceControllerListSpaceV1(searchParams)
            if (res.code === 1) {
                spaceList.value = res.data.list
                total.value = res.data.total
            }
        } catch (error) {
            message.error('获取数据失败')
        }
    }
    const columns = ref<TableColumnProps[]>([
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },
        {
            title: '空间名称',
            dataIndex: 'spaceName',
            key: 'spaceName'
        },
        {
            title: '空间级别',
            key: 'spaceLevel',
            dataIndex: 'spaceLevel'
        },
        {
            title: '使用情况',
            key: 'case',
            width: 200
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 200
        }
    ])
    const openEditDialog = ref<boolean>(false)
    const editRecord = ref<API.UpdateSpaceDto>()
    const handleEdit = (record: API.SpaceModelVo) => {
        openEditDialog.value = true
        editRecord.value = {
            id: record.id,
            spaceName: record.spaceName,
            spaceLevel: record.spaceLevel,
            maxSize: record.maxSize,
            maxCount: record.maxCount
        } as API.UpdateSpaceDto
    }
    const handleDelete = (record: API.SpaceModelVo) => {
        Modal.confirm({
            title: '确定要删除吗？',
            content: '删除后将无法恢复',
            onOk: async () => {
                try {
                    const res = await spaceControllerDeleteSpaceV1({ id: record.id })
                    if (res.code === 1) {
                        message.success('删除成功')
                        fetchSpaceList()
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('删除失败')
                }
            }
        })
    }
    const handleEditConfirm = async (updateSpaceDto: API.UpdateSpaceDto) => {
        if (updateSpaceDto) {
            try {
                updateSpaceDto.maxSize = transformSize(updateSpaceDto.maxSize)
                const res = await spaceControllerUpdateSpaceV1(updateSpaceDto)
                if (res.code === 1) {
                    message.success('编辑成功')
                    openEditDialog.value = false
                    fetchSpaceList()
                } else {
                    message.error(res.message)
                }
            } catch (error) {
                message.error('编辑失败')
            }
        }
    }
    const handleQuery = (queryParams: API.QuerySpaceDto) => {
        searchParams.spaceName = queryParams.spaceName
        searchParams.spaceLevel = queryParams.spaceLevel
    }
    watchEffect(() => {
        fetchSpaceList()
    })
    return {
        searchParams,
        spaceList,
        total,
        columns,
        handleEdit,
        handleDelete,
        openEditDialog,
        editRecord,
        handleEditConfirm,
        handleQuery
    }
}

export default useSpaceAdminHooks
