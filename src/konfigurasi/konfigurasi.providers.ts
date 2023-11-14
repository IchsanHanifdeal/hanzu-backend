
import { Konfigurasi } from './konfigurasi.entity';

export const KonfigurasiProviders = [
    {
        provide: 'KONFIGURASI_REPOSITORY',
        useValue: Konfigurasi,
    },
];
