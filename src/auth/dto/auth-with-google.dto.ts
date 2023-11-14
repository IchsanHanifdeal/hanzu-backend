import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class AuthWithGoogleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    @Transform(({ value }) => typeof value === 'number' ? value.toString() : value)
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    displayName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    photoUrl?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hardwareId: string;
}