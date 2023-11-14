import { Body, Controller, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Observable, of } from 'rxjs';
import { extname, join } from 'path';
import { ChangePasswordDto, ChangePhotoProfileDto, ChangeProfileDto, QueryAccountDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@ApiBearerAuth()
@ApiTags('Current Account Information')
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query() query: QueryAccountDto, @Req() { user }: any) {
        if (user.role === 'Admin') {
            return this.accountService.findAll(query);
        } else {
            throw new ForbiddenException('Only administrator can access this endpoint.')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    me(@Req() { user }: any) {
        return this.accountService.me(+user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user/:userId')
    findUser(@Param('userId') userId: string) {
        return this.accountService.findUser(+userId);
    }

    @Get('/foto-profil/:filename')
    getPhotoProfile(@Param('filename') filename: string, @Res() res): Observable<Object> {
        let directory = join(process.cwd(), 'uploads/foto-profil/' + filename);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('change-profile')
    changeProfile(@Body() data: ChangeProfileDto, @Req() { user }: any) {
        return this.accountService.changeProfile(data, +user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('gambar', {
        storage: diskStorage({
            destination: './uploads/foto-profil',
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
    @Put('change-photo-profile')
    changePhotoProfile(@Body() _: ChangePhotoProfileDto, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 2048000 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) gambar: Express.Multer.File, @Req() { user }: any) {
        return this.accountService.changePhotoProfile(gambar.filename, +user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('change-password')
    changePassword(@Body() data: ChangePasswordDto, @Req() { user }: any) {
        return this.accountService.changePassword(data, user.id)
    }
}
