import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { CSSProperties, h, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useGlobalSider = () => {
    const router = useRouter()
    const siderStyle: CSSProperties = {
        color: '#fff',
        backgroundColor: '#34495E'
    }
    const menuItems = [
        {
            key: '/',
            label: '公共图库',
            title: '公共图库',
            icon: () => h(PictureOutlined)
        },
        {
            key: '/space/user',
            label: '我的空间',
            title: '我的空间',
            icon: () => h(UserOutlined)
        }
    ]
    const handleClick = ({ key }: { key: string }) => {
        router.push({
            path: key
        })
    }
    const current = ref<string[]>(['/'])
    router.afterEach((to, _from) => {
        current.value = [to.path]
    })
    return { siderStyle, handleClick, menuItems, current }
}
