import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertIncomeDto, QueryIncomeDto } from './dto';
import { Op } from 'sequelize';
import { FindAllIncomeInterface } from './interface';
import { Income } from './income.entity';
import { Event } from 'src/event/event.entity';

@Injectable()
export class IncomeService {
    constructor(
        @Inject('INCOME_REPOSITORY')
        private incomeRepository: typeof Income,
    ) { }

    async findAll(query: QueryIncomeDto): Promise<FindAllIncomeInterface> {
        const income = await this.incomeRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            include: [{
                model: Event,
                as: 'event',
            }],
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        '$event.nama$': {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        tanggal: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        jumlah: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.incomeRepository.count({
            include: [{
                model: Event,
                as: 'event',
            }],
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        '$event.nama$': {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        tanggal: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        jumlah: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        return {
            data: income,
            totalData: jumlahData,
            totalRow: income.length
        }
    }

    async findOne(id: number): Promise<Income> {
        const income = await this.incomeRepository.findOne({
            include: [{
                model: Event,
                as: 'event',
            }],
            where: { id }
        });

        if (!income) throw new UnprocessableEntityException('Income not found');

        return income;
    }

    async create(data: InsertIncomeDto): Promise<Income> {
        return await this.incomeRepository.create({ ...data }, { raw: true }).then(async (res) => await this.incomeRepository.findByPk(res.id));
    }

    async update(id: number, data: InsertIncomeDto): Promise<Income> {
        const income = await this.incomeRepository.findOne({ where: { id } });

        if (!income) throw new UnprocessableEntityException('Income not found');

        return await this.incomeRepository.update({ ...data }, { where: { id } }).then(async () => await this.incomeRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Income> {
        const income = await this.incomeRepository.findOne({ where: { id } });

        if (!income) throw new UnprocessableEntityException('Income not found');

        return await this.incomeRepository.destroy({ where: { id } }).then(() => income);
    }
}
