import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from './auth.service';
import { AuthWithGoogleDto, CheckResetPasswordTokenDto, LoginDto, RegisterDto, RequestResetPasswordDto, ResetPasswordDto } from './dto';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private mailService: MailService) { }

    @Get('gambar/:id')
    async ambilGambar(@Param('id') id: string, @Res() res): Promise<Observable<Object>> {
        let auth = await this.authService.findOne(isNaN(+id) ? 0 : +id);
        let directory = join(process.cwd(), 'uploads/foto-profil/' + auth.gambar);
        if (!fs.existsSync(directory)) directory = join(process.cwd(), 'uploads/error.png');
        return of(res.sendFile(directory));
    }

    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Patch('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    @Post('reset-password')
    resetPassword(@Req() req: any, @Body() data: ResetPasswordDto) {
        return this.mailService.sendResetPassword(data.email, req.protocol, req.get('Host'));
    }

    @Post('check-reset-password-token')
    checkResetPasswordToken(@Body() data: CheckResetPasswordTokenDto) {
        return this.authService.checkResetPasswordToken(data);
    }

    @Put('reset-password')
    requestResetPassword(@Body() data: RequestResetPasswordDto) {
        return this.authService.requestResetPassword(data);
    }
}
