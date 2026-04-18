import { Injectable } from '@nestjs/common'
import { Observable, Subject, filter } from 'rxjs'

interface MessageEvent {
    userId: string
    data: {
        title: string
        content: string
        id: string
        messageType?: string
        result?: number
        spaceId?: string
        actionUrl?: string
    }
}

@Injectable()
export class SseService {
    private messageSubject = new Subject<MessageEvent>()

    emit(event: MessageEvent) {
        this.messageSubject.next(event)
    }

    subscribe(userId: string): Observable<MessageEvent> {
        return this.messageSubject.asObservable().pipe(filter(event => event.userId === userId))
    }
}
