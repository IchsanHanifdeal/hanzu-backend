import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Op } from 'sequelize';
import { UpsertKonfigurasiDto, QueryKonfigurasiDto, UpsertGambarKonfigurasiDto } from './dto';
import { Konfigurasi } from './konfigurasi.entity';

@Injectable()
export class KonfigurasiService {
    constructor(
        @Inject('KONFIGURASI_REPOSITORY')
        private konfigurasiRepository: typeof Konfigurasi
    ) { }

    async findAll(query: QueryKonfigurasiDto): Promise<Konfigurasi[]> {
        const konfigurasi = await this.konfigurasiRepository.findAll({ where: { nama: { [Op.in]: query.nama } }, raw: true })
        return konfigurasi
    }

    async upsert(data: UpsertKonfigurasiDto) {
        let nama = []

        const upsertData = Promise.all(
            data.upsert.map(async (val) => {
                nama.push(val.nama);
                await this.konfigurasiRepository.upsert(val)
            })
        ).then(async () => {
            return await this.konfigurasiRepository.findAll({ where: { nama: { [Op.in]: nama } } })
        })

        return upsertData
    }

    async upsertGambar(filename: string, data: UpsertGambarKonfigurasiDto) {
        return this.upsert({
            upsert: [{
                nama: data.nama,
                nilai: filename
            }]
        });
    }
}