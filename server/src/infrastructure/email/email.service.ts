import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as NodeMailer from 'nodemailer'

@Injectable()
export class EmailService implements OnModuleInit {
    private transporter: NodeMailer.Transporter | null = null
    constructor(private readonly configService: ConfigService) {}
    onModuleInit() {
        this.transporter = NodeMailer.createTransport({
            port: this.configService.get<number>('email.port'),
            host: this.configService.get<string>('email.host'),
            auth: {
                user: this.configService.get<string>('email.user'),
                pass: this.configService.get<string>('email.password')
            },
            secure: !!Number(this.configService.get<boolean>('email.useSSL'))
        })
    }

    /**
     *
     * @param to 发给谁
     * @param subject 主题
     * @param text 内容
     */
    async sendEmail(to: string, subject: string, text: string) {
        try {
            await this.transporter?.sendMail({
                from: this.configService.get<string>('email.from'),
                to,
                subject,
                html: text
            })
            return true
        } catch (error) {
            console.log(error)
        }
    }
}
