import { Event } from './event.entity';

export const EventProviders = [
    {
        provide: 'EVENT_REPOSITORY',
        useValue: Event,
    },
];