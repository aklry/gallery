import { Injectable } from '@nestjs/common'
import { Picture } from '@gallery/picture/entities/picture.entity'
import { SpaceUser } from '@space/user/entities/space-user.entity'

@Injectable()
export class SpaceUserAuthContext {
    private id: string
    private pictureId: string
    private spaceId: string
    private spaceUserId: string
    private picture: Picture
    private spaceUser: SpaceUser

    public static getAuthContextByRequest(request: any) {
        const { method, body = {}, params = {}, query = {}, url = '' } = request
        const spaceUserAuthContext = new SpaceUserAuthContext()
        const source = method === 'GET' ? { ...query, ...params } : body

        if (source.id) {
            spaceUserAuthContext.id = source.id
        }
        if (source.pictureId) {
            spaceUserAuthContext.pictureId = source.pictureId
        }
        if (source.spaceId) {
            spaceUserAuthContext.spaceId = source.spaceId
        }
        if (source.spaceUserId) {
            spaceUserAuthContext.spaceUserId = source.spaceUserId
        }

        const match = url.match(/\/api\/v1\/([^/?]+)/)
        if (match) {
            const [, field] = match
            switch (field) {
                case 'picture':
                    if (spaceUserAuthContext.id && !spaceUserAuthContext.pictureId) {
                        spaceUserAuthContext.pictureId = spaceUserAuthContext.id
                    }
                    break
                case 'space':
                    if (spaceUserAuthContext.id && !spaceUserAuthContext.spaceId) {
                        spaceUserAuthContext.spaceId = spaceUserAuthContext.id
                    }
                    break
                case 'space-user':
                    if (spaceUserAuthContext.id && !spaceUserAuthContext.spaceUserId) {
                        spaceUserAuthContext.spaceUserId = spaceUserAuthContext.id
                    }
                    break
            }
        }

        return spaceUserAuthContext
    }

    public getId() {
        return this.id
    }

    public getPictureId() {
        return this.pictureId
    }

    public getSpaceId() {
        return this.spaceId
    }

    public getSpaceUserId() {
        return this.spaceUserId
    }

    public getPicture() {
        return this.picture
    }

    public getSpaceUser() {
        return this.spaceUser
    }
}
