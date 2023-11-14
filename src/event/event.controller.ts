import { Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { AuthGuard } from '@nestjs/passport';
import { InsertEventDto, QueryEventDto, UpdateEventDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';

@ApiTags('Event')
@ApiBearerAuth()
@Controller('event')
export class EventController {
    constructor(private eventService: EventService) { }

    @Get()
    findAll(@Query() query: QueryEventDto) {
        return this.eventService.findAll(query);
    }

    @Get('gambar/:filename')
    async ambilGambar(@Param('filename') filename: string, @Res() res): Promise<Observable<Object>> {
        let directory = join(process.cwd(), 'uploads/event/' + filename);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/event',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Patch()
    create(@Body() data: InsertEventDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5120000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File) {
        if (user.role === 'Admin' || user.role === 'Panitia') {
            return this.eventService.create(data, gambar.filename);
        } else {
            throw new ForbiddenException('Only administrator and panitia can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/event',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateEventDto, @Req() { user }: any, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5120000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false
    })) gambar?: Express.Multer.File) {
        if (user.role === 'Admin' || user.role === 'Panitia') {
            return this.eventService.update(+id, data, gambar?.filename);
        } else {
            throw new ForbiddenException('Only administrator and panitia can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() { user }: any) {
        if (user.role === 'Admin' || user.role === 'Panitia') {
            return this.eventService.delete(+id);
        } else {
            throw new ForbiddenException('Only administrator and panitia can access this endpoint.')
        }
    }
}