import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertIncomeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    eventId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => typeof value === 'string' ? +value : value)
    jumlah: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tanggal: string;
}