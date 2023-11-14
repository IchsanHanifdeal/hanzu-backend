import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpsertGambarKonfigurasiDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nama: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true
    })
    gambar: Express.Multer.File;
}