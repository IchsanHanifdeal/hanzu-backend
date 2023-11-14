import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthProviders } from 'src/auth/auth.providers';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordProviders } from 'src/auth/reset-password.providers';

@Module({
  controllers: [AccountController],
  providers: [
    ...AuthProviders,
    ...ResetPasswordProviders,
    AccountService,
    MailService,
  ]
})
export class AccountModule { }
