import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventProviders } from './event.providers';

@Module({
  controllers: [EventController],
  providers: [EventService, ...EventProviders]
})
export class EventModule { }
