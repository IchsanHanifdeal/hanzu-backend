
import { ResetPassword } from './reset-password.entity';

export const ResetPasswordProviders = [
    {
        provide: 'RESET_PASSWORD_REPOSITORY',
        useValue: ResetPassword,
    },
];
