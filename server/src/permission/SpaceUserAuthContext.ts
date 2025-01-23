import { Injectable } from '@nestjs/common'
import { Picture } from '../picture/entities/picture.entity'
import { SpaceUser } from '../space-user/entities/space-user.entity'

@Injectable()
export class SpaceUserAuthContext {
    private id: string
    private pictureId: string
    private spaceId: string
    private spaceUserId: string
    private picture: Picture
    private spaceUser: SpaceUser

    public static getAuthContextByRequest(request: any) {
        const { method, body, params, query, url } = request
        const spaceUserAuthContext = new SpaceUserAuthContext()
        switch (method) {
            case 'POST':
                if (body.id) {
                    spaceUserAuthContext.id = body.id
                }
                break
            case 'GET':
                if (params.id) {
                    spaceUserAuthContext.id = params.id
                } else if (query.id) {
                    spaceUserAuthContext.id = query.id
                }
                break
        }
        const id = spaceUserAuthContext.id
        const reg = /\/api\/v1\/([^/]+)/
        if (reg.test(url)) {
            const [, field] = url.match(reg)
            switch (field) {
                case 'picture':
                    spaceUserAuthContext.pictureId = id
                    break
                case 'space':
                    spaceUserAuthContext.spaceId = id
                    break
                case 'space-user':
                    spaceUserAuthContext.spaceUserId = id
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
