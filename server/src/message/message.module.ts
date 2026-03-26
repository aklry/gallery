import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { SseModule } from '../sse/sse.module'

@Module({
    controllers: [MessageController],
    providers: [MessageService],
    imports: [SseModule],
    exports: [MessageService]
})
export class MessageModule {}
