import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { MailService } from 'src/mail/mail.service';
import { AuthController } from './auth.controller';
import { AuthProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { ResetPasswordProviders } from './reset-password.providers';
import { JwtStrategy } from './strategy';

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    ...AuthProviders,
    ...ResetPasswordProviders,
    AuthService,
    MailService,
    JwtStrategy
  ]
})
export class AuthModule { }
