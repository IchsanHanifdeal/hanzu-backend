import { Module } from '@nestjs/common';
import { KonfigurasiController } from './konfigurasi.controller';
import { KonfigurasiProviders } from './konfigurasi.providers';
import { KonfigurasiService } from './konfigurasi.service';

@Module({
  controllers: [KonfigurasiController],
  providers: [KonfigurasiService, ...KonfigurasiProviders]
})
export class KonfigurasiModule { }
