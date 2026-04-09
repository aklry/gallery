import { message, Modal } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { pictureControllerDeletePictureV1 } from '@/api/picture'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { downloadPicture as download } from '@/utils'
import { pictureDetailCache } from '@/utils/picture-detail-cache'

const SEO_SCRIPT_ID = 'picture-jsonld'

function injectStructuredData(picture: API.GetPictureVoModel) {
    removeStructuredData()
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        name: picture.name,
        contentUrl: picture.url,
        thumbnailUrl: picture.thumbnailUrl || picture.url,
        description: picture.introduction || picture.name,
        width: { '@type': 'QuantitativeValue', value: picture.picWidth },
        height: { '@type': 'QuantitativeValue', value: picture.picHeight },
        encodingFormat: picture.picFormat,
        datePublished: picture.createTime,
        dateModified: picture.editTime,
        author: picture.user ? { '@type': 'Person', name: picture.user.userName } : undefined
    }
    const script = document.createElement('script')
    script.id = SEO_SCRIPT_ID
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
}

function removeStructuredData() {
    const existing = document.getElementById(SEO_SCRIPT_ID)
    if (existing) existing.remove()
}

function updatePageMeta(picture: API.GetPictureVoModel) {
    document.title = `${picture.name} - 映刻`
    const desc = picture.introduction || picture.name
    setMeta('description', desc)
    setMeta('og:title', picture.name, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:image', picture.url, 'property')
    setMeta('og:type', 'article', 'property')
    setMeta('twitter:title', picture.name)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', picture.url)
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
    if (el) {
        el.content = content
    } else {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        el.content = content
        document.head.appendChild(el)
    }
}

const usePictureDetail = (id: string) => {
    const picture = ref<API.GetPictureVoModel>()
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const spaceId = route.query.spaceId as string
    const canEditOrDelete = computed(() => {
        const user = userStore.loginUser
        if (!user || !user.id) return false
        const pictureUser = picture.value?.user
        return user.id === pictureUser?.id || user.userRole === 'admin'
    })
    const getPictureDetail = async () => {
        try {
            picture.value = await pictureDetailCache.get(id)
            if (picture.value) {
                updatePageMeta(picture.value)
                injectStructuredData(picture.value)
            }
        } catch (error) {
            message.error(error instanceof Error ? error.message : '获取图片详情失败')
        }
    }
    const deletePicture = async () => {
        Modal.confirm({
            title: '确定要删除这张图片吗？',
            content: '删除后将无法恢复',
            okText: '删除',
            cancelText: '取消',
            onOk: async () => {
                try {
                    if (!canEditOrDelete.value) {
                        message.error('您没有权限删除这张图片')
                        return
                    }
                    const res = await pictureControllerDeletePictureV1({ id })
                    if (res.code === 1) {
                        pictureDetailCache.invalidate(id)
                        message.success('删除图片成功')
                    } else {
                        message.error(res.message || '删除图片失败')
                        return
                    }
                    setTimeout(() => {
                        router.push('/')
                    }, 1000)
                } catch (error) {
                    message.error('删除图片失败')
                }
            }
        })
    }
    const editPicture = () => {
        if (!canEditOrDelete.value) {
            message.error('您没有权限编辑这张图片')
            return
        }
        if (spaceId) {
            router.push(`/picture/add?id=${id}&spaceId=${spaceId}`)
        } else {
            router.push(`/picture/add?id=${id}`)
        }
    }
    const downloadPicture = (url?: string, filename?: string) => {
        if (!userStore.loginUser.id) {
            message.info('请先登录，登录后将自动为您下载')
            const targetPath = route.fullPath + (route.fullPath.includes('?') ? '&' : '?') + 'action=download'
            router.push(`/user/login?redirect=${encodeURIComponent(targetPath)}`)
            return
        }
        download(url, filename)
    }
    onMounted(async () => {
        await getPictureDetail()
        // 登录回跳后自动触发下载逻辑
        if (route.query.action === 'download' && userStore.loginUser.id && picture.value) {
            downloadPicture(picture.value.url, picture.value.name)
            // 清除 action 参数防刷新重复下载
            const query = { ...route.query }
            delete query.action
            router.replace({ query })
        }
    })
    onUnmounted(() => {
        removeStructuredData()
    })
    return {
        picture,
        deletePicture,
        canEditOrDelete,
        editPicture,
        downloadPicture
    }
}

export default usePictureDetail
