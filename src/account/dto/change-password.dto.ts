import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, ValidateIf } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordLama: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordBaru: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    konfirmasiPasswordBaru: string;
}