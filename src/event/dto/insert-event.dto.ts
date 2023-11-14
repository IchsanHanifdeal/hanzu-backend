import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EventStatus } from "src/general/event-status.type";

export class InsertEventDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nama: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    deskripsi: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nagari: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tanggalMulai: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tanggalSelesai: string;

    @ApiProperty({ enum: EventStatus })
    @IsNotEmpty()
    @IsEnum(EventStatus)
    status: EventStatus;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true
    })
    gambar: Express.Multer.File;
}