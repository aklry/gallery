import { useUserStore } from '@/store/modules/user'
import { reactive, ref } from 'vue'
import { userControllerEditUserV1 } from '@/api/user'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
const useUserCenter = () => {
    const userStore = useUserStore()
    const { loginUser: userInfo } = storeToRefs(userStore)
    const open = ref(false)
    const picture = ref<API.UploadAvatarVoModel>()
    const form = reactive<API.EditUserDto>({
        id: userInfo.value.id,
        userName: userInfo.value.userName,
        userAvatar: userInfo.value.userAvatar,
        userProfile: userInfo.value.userProfile,
        userPassword: ''
    })
    const handleOk = async () => {
        open.value = false
        try {
            const res = await userControllerEditUserV1(form)
            if (res.data) {
                message.success('修改成功')
                userStore.fetchLoginUser()
            }
        } catch (error) {
            message.error('修改失败')
        }
    }
    const handleUploadSuccess = (result: API.UploadAvatarVoModel) => {
        picture.value = result
        form.userAvatar = result.url
    }
    return {
        userInfo,
        open,
        form,
        picture,
        handleOk,
        handleUploadSuccess
    }
}

export default useUserCenter
