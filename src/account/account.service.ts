import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Auth } from 'src/auth/auth.entity';
import { ChangePasswordDto, ChangeProfileDto, QueryAccountDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FindAllAccountInterface } from './interface';

@Injectable()
export class AccountService {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private authRepository: typeof Auth,

        private config: ConfigService,

        private mailService: MailService

    ) { }

    async findAll(query: QueryAccountDto): Promise<FindAllAccountInterface> {
        const account = await this.authRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[Array.isArray(query.order.index) ? Sequelize.col(query.order.index.join('.')) : query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        namaLengkap: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        role: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.authRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        namaLengkap: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        role: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: account,
            totalData: jumlahData,
            totalRow: account.length
        }
    }

    async me(userId: number) {
        return await this.authRepository.findByPk(userId)
    }

    async findUser(userId: number): Promise<Auth> {
        return this.authRepository.findByPk(userId, {
            attributes: ['id', 'namaLengkap', 'email', 'gambar', 'role']
        })
    }

    async changeProfile(data: ChangeProfileDto, userId: number) {
        return await this.authRepository.update({ ...data }, { where: { id: userId } }).then(async () => await this.authRepository.findByPk(userId));
    }

    async changePhotoProfile(gambar: Express.Multer.File['filename'], userId: number) {
        return await this.authRepository.update({ gambar }, { where: { id: userId } }).then(async () => await this.authRepository.findByPk(userId));
    }

    async changePassword(data: ChangePasswordDto, userId: number) {
        if (data.passwordBaru != data.konfirmasiPasswordBaru) throw new BadRequestException({
            statusCode: 400,
            konfirmasiPasswordBaru: 'konfirmasiPasswordBaru must match with passwordBaru',
            error: 'Bad Request'
        })

        const userData = await this.authRepository.findByPk(userId)

        if (!(await bcrypt.compare(data.passwordLama, userData.password))) throw new BadRequestException({
            statusCode: 400,
            passwordLama: 'passwordLama is invalid',
            error: 'Bad Request'
        })

        const salt = bcrypt.genSaltSync(+this.config.get<number>('SALT_ROUND'));
        const password_hash = bcrypt.hashSync(data.passwordBaru, salt);
        return await this.authRepository.update({ password: password_hash }, { where: { id: userId } }).then(() => userData);
    }
}
