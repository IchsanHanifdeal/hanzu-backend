import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.provider';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [...databaseProviders, ConfigService],
    exports: [...databaseProviders]
})
export class DatabaseModule { }
