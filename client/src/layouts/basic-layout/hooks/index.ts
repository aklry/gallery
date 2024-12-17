import { HomeOutlined } from '@ant-design/icons-vue'
import { type MenuProps } from 'ant-design-vue'
import { h, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
export const useMenus = () => {
    const originItems = [
        {
            key: '/',
            label: '主页',
            title: '主页',
            icon: () => h(HomeOutlined)
        },
        {
            key: '/picture/add',
            label: '创建图片',
            title: '创建图片'
        },
        {
            key: '/user/admin',
            label: '用户管理',
            title: '用户管理'
        },
        {
            key: '/picture/admin',
            label: '图片管理',
            title: '图片管理'
        }
    ]

    const filterMenus = (menus: MenuProps['items'] = []) => {
        return menus.filter(menu => {
            if (menu?.key?.toString().includes('admin')) {
                const userStore = useUserStore()
                const loginUser = userStore.loginUser
                if (!loginUser || loginUser.userRole !== 'admin') {
                    return false
                }
            }

            return true
        })
    }
    const items = computed<MenuProps['items']>(() => filterMenus(originItems))
    return {
        items
    }
}
