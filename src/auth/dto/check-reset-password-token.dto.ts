import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CheckResetPasswordTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}