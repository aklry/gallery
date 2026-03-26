import { Injectable } from '@nestjs/common'
import { Subject, Observable, filter } from 'rxjs'

interface MessageEvent {
    userId: string
    data: {
        title: string
        content: string
        id: string
    }
}

@Injectable()
export class SseService {
    // 全局事件流
    // 全局事件流
    private messageSubject = new Subject<MessageEvent>()

    /**
     * 发送通知（在审核完成后调用）
     */
    emit(event: MessageEvent) {
        this.messageSubject.next(event)
    }

    /**
     * 订阅某个用户的消息流（SSE 连接时调用）
     */
    subscribe(userId: string): Observable<MessageEvent> {
        return this.messageSubject.asObservable().pipe(filter(event => event.userId === userId))
    }
}
