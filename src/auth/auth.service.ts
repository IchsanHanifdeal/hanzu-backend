import { BadRequestException, ForbiddenException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.entity';
import { AuthWithGoogleDto, CheckResetPasswordTokenDto, LoginDto, RegisterDto, RequestResetPasswordDto } from './dto';
import * as bcrypt from 'bcrypt'
import { ResetPassword } from './reset-password.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import * as fs from 'fs';
import { MailService } from 'src/mail/mail.service';
import { RoleType } from 'src/general/role.type';

@Injectable()
export class AuthService {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private authRepository: typeof Auth,

        @Inject('RESET_PASSWORD_REPOSITORY')
        private resetPasswordRepository: typeof ResetPassword,

        private jwt: JwtService,

        private config: ConfigService,
    ) { }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '30d',
                secret: this.config.get<string>('JWT_SECRET')
            }
        )
        return {
            access_token: token
        }
    }

    async findOne(id: number): Promise<Auth> {
        const auth = await this.authRepository.findOne({ where: { id } });

        if (!auth) throw new UnprocessableEntityException('Auth not found');

        return auth;
    }

    async login(data: LoginDto): Promise<{ access_token: string }> {
        const user: any = await this.authRepository.findOne({
            where: {
                email: data.email
            }
        })

        if (!user) throw new ForbiddenException('Credentials incorrect')

        if (bcrypt.compareSync(data.password, user.password)) {
            return this.signToken(user.id, user.email)
        } else {
            throw new ForbiddenException('Credentials incorrect')
        }
    }

    async register(data: RegisterDto) {
        const salt = bcrypt.genSaltSync(+this.config.get<number>('SALT_ROUND'));
        const password_hash = bcrypt.hashSync(data?.password ? data.password : '12345678', salt)
        try {
            const user: Auth = await this.authRepository.create({
                ...data,
                role: RoleType.Pengujung,
                password: password_hash,
            })
            delete user.password
            return user
        } catch (err) {
            const errors = err.errors.map((val) => ({
                [val.path]: val.message
            }));

            if (err.name === 'SequelizeUniqueConstraintError') throw new BadRequestException({
                statusCode: 400,
                ...errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
                error: 'Bad Request',

            })
        }
    }

    async checkResetPasswordToken(data: CheckResetPasswordTokenDto) {
        const resetPassword = await this.resetPasswordRepository.findOne({
            where: {
                uniqueCode: data.token,
                '$auth.email$': data.email
            },
            include: {
                model: Auth,
                as: 'auth'
            }
        });

        if (!resetPassword) throw new ForbiddenException('Credentials incorrect')

        return resetPassword
    }

    async requestResetPassword(data: RequestResetPasswordDto) {
        const resetPassword = await this.resetPasswordRepository.findOne({
            where: {
                uniqueCode: data.token,
                '$auth.email$': data.email
            },
            include: {
                model: Auth,
                as: 'auth'
            }
        });

        if (!resetPassword) throw new ForbiddenException('Credentials incorrect')

        if (data.passwordBaru !== data.konfirmasiPasswordBaru) throw new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            konfirmasiPasswordBaru: 'konfirmasiPasswordBaru must be the same as passwordBaru'
        })

        const salt = bcrypt.genSaltSync(+this.config.get<number>('SALT_ROUND'));
        const password_hash = bcrypt.hashSync(data.passwordBaru, salt)
        await this.authRepository.update({
            password: password_hash
        }, {
            where: { id: resetPassword.authId }
        })
        await this.resetPasswordRepository.destroy({ where: { uniqueCode: data.token } })
        const user = await this.authRepository.findByPk(resetPassword.authId, { raw: true })
        delete user.password
        return user
    }
}
