import { PictureCardProps } from '../types'
import { useRouter } from 'vue-router'

const usePictureCard = (props: PictureCardProps) => {
    const router = useRouter()
    const goToPictureDetail = (id: string) => {
        router.push(`/picture/${id}?spaceId=${props.spaceId}`)
    }
    return {
        goToPictureDetail
    }
}

export default usePictureCard
