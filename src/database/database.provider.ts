import * as pg from 'pg';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { ResetPassword } from 'src/auth/reset-password.entity';
import { Event } from 'src/event/event.entity';
import { Income } from 'src/income/income.entity';
import { Konfigurasi } from 'src/konfigurasi/konfigurasi.entity';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize: Sequelize = new Sequelize({
                dialect: 'postgres',
                host: configService.get<string>('DATABASE_HOST', 'localhost'),
                port: configService.get<number>('DATABASE_PORT', 5432),
                username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
                password: configService.get<string>('DATABASE_PASSWORD', '123456'),
                database: configService.get<string>('DATABASE_NAME', 'snse'),
                dialectOptions: {
                    useUTC: false,
                    timezone: 'local'
                },
                timezone: 'Asia/Jakarta'
            });
            sequelize.addModels([Auth, ResetPassword, Konfigurasi, Event, Income]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
