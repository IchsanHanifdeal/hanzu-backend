import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { AccountModule } from './account/account.module';
import { KonfigurasiModule } from './konfigurasi/konfigurasi.module';
import { EventModule } from './event/event.module';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    AuthModule,
    AccountModule,
    ConfigModule,
    KonfigurasiModule,
    AccountModule,
    DatabaseModule,
    EventModule,
    IncomeModule,
  ],
})
export class AppModule { }
