import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InsertEventDto, QueryEventDto, UpdateEventDto } from './dto';
import { Op } from 'sequelize';
import { FindAllEventInterface } from './interface';
import { Event } from './event.entity';

@Injectable()
export class EventService {
    constructor(
        @Inject('EVENT_REPOSITORY')
        private eventRepository: typeof Event,
    ) { }

    async findAll(query: QueryEventDto): Promise<FindAllEventInterface> {
        const event = await this.eventRepository.findAll({
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        nama: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.eventRepository.count({
            where: {
                ...(query.search && {
                    [Op.or]: [{
                        nama: {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: event,
            totalData: jumlahData,
            totalRow: event.length
        }
    }

    async findOne(id: number): Promise<Event> {
        const event = await this.eventRepository.findOne({
            where: { id }
        });

        if (!event) throw new UnprocessableEntityException('Event not found');

        return event;
    }

    async create(data: InsertEventDto, gambar: Express.Multer.File['filename']): Promise<Event> {
        return await this.eventRepository.create({ ...data, gambar }, { raw: true }).then(async (res) => await this.eventRepository.findByPk(res.id));
    }

    async update(id: number, data: UpdateEventDto, gambar?: Express.Multer.File['filename']): Promise<Event> {
        const event = await this.eventRepository.findOne({ where: { id } });

        if (!event) throw new UnprocessableEntityException('Event not found');

        return await this.eventRepository.update({ ...data, gambar: gambar ?? event.gambar }, { where: { id } }).then(async () => await this.eventRepository.findOne({
            where: { id }
        }));

    }

    async delete(id: number): Promise<Event> {
        const event = await this.eventRepository.findOne({ where: { id } });

        if (!event) throw new UnprocessableEntityException('Event not found');

        return await this.eventRepository.destroy({ where: { id } }).then(() => event);
    }
}
