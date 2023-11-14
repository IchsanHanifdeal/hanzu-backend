import { Body, Controller, ForbiddenException, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpsertKonfigurasiDto, QueryKonfigurasiDto, UpsertGambarKonfigurasiDto } from './dto';
import { KonfigurasiService } from './konfigurasi.service';
import { Observable, of } from 'rxjs';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@ApiTags('Konfigurasi')
@Controller('konfigurasi')
export class KonfigurasiController {
    constructor(private konfigurasiService: KonfigurasiService) { }

    @Get()
    findAll(@Query() query: QueryKonfigurasiDto) {
        return this.konfigurasiService.findAll(query)
    }

    @Get('gambar/:filename')
    getGambar(@Param('filename') filename: string, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/konfigurasi/' + filename)));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    upsert(@Body() data: UpsertKonfigurasiDto) {
        return this.konfigurasiService.upsert(data);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/konfigurasi',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    }))
    @ApiConsumes('multipart/form-data')
    @Post('gambar')
    updateGambar(@Body() data: UpsertGambarKonfigurasiDto, @UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /(jpg|jpeg|png|gif)$/,
            })
            .addMaxSizeValidator({
                maxSize: 2048000
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            })) gambar: Express.Multer.File, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.konfigurasiService.upsertGambar(gambar.filename, data);
        } else {
            throw new ForbiddenException('This endpoint only accessible for Administrator only')
        }
    }
}