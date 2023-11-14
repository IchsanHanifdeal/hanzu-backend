import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RequestResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    passwordBaru: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    konfirmasiPasswordBaru: string;
}