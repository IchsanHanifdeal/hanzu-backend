import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IncomeService } from './income.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertIncomeDto, QueryIncomeDto } from './dto';

@ApiTags('Income')
@ApiBearerAuth()
@Controller('income')
export class IncomeController {
    constructor(private incomeService: IncomeService) { }

    @Get()
    findAll(@Query() query: QueryIncomeDto) {
        return this.incomeService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.incomeService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    create(@Body() data: InsertIncomeDto, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Panitia') {
            return this.incomeService.create(data);
        } else {
            throw new ForbiddenException('Only administrator and panitia can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: InsertIncomeDto, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Panitia') {
            return this.incomeService.update(+id, data);
        } else {
            throw new ForbiddenException('Only administrator and panitia can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Panitia') {
            return this.incomeService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator and panitia can access this endpoint.')
        }
    }
}
