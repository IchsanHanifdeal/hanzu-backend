import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { IncomeProviders } from './income.providers';

@Module({
  controllers: [IncomeController],
  providers: [IncomeService, ...IncomeProviders]
})
export class IncomeModule { }
