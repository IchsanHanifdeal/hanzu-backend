import { Auth } from './auth.entity';

export const AuthProviders = [
    {
        provide: 'AUTH_REPOSITORY',
        useValue: Auth,
    },
];
