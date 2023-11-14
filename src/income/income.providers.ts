import { Income } from './income.entity';

export const IncomeProviders = [
    {
        provide: 'INCOME_REPOSITORY',
        useValue: Income,
    },
];