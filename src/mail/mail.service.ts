import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/auth/auth.entity';
import { ResetPassword } from 'src/auth/reset-password.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        @Inject('AUTH_REPOSITORY')
        private authRepository: typeof Auth,
        @Inject('RESET_PASSWORD_REPOSITORY')
        private resetPasswordRepository: typeof ResetPassword,
        private configService: ConfigService,
    ) { }

    async sendResetPassword(email: string, protocol: string, host: string) {
        // const url = `${protocol}://${host}/reset_password?token=${token}`;
        const auth: Auth = await this.authRepository.findOne({ where: { email: email } })

        if (!auth) throw new BadRequestException({
            statusCode: 400,
            email: 'email doesn\'t registered!',
            error: 'Bad Request'
        })

        const resetData: ResetPassword = await this.resetPasswordRepository.findOne({ where: { authId: auth.id } })
        let token: number = 0;

        if (resetData) {
            token = resetData.uniqueCode
        } else {
            token = await this.generateUniqueCode(6);
            await this.resetPasswordRepository.create({
                authId: auth.id,
                uniqueCode: token
            })
        }

        const url = `${this.configService.get<string>('PRODUCTION') === 'true' ? 'https://backend.tripvel.com' : 'http://localhost:3000'}/reset_password?token=${token}`;
        return await this.mailerService.sendMail({
            to: auth.email,
            from: `"${this.configService.get<string>('MAIL_NAME')}" <${this.configService.get<string>('MAIL_USER')}>`,
            subject: 'Reset Password | Tripvel',
            template: './reset-password',
            context: {
                name: `${auth.namaLengkap}`,
                token,
                url,
            },
        });
    }

    async generateUniqueCode(length: number): Promise<number> {
        var add = 1, max = 12 - add;

        if (length > max) {
            return await this.generateUniqueCode(max) + await this.generateUniqueCode(length - max);
        }

        max = Math.pow(10, length + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        const uniqueCode = parseInt(("" + number).substring(add));
        const check = await this.resetPasswordRepository.findOne({ where: { uniqueCode } });

        if (!check) return uniqueCode;
        else return this.generateUniqueCode(length);
    }
}