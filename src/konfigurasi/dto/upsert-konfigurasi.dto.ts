import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class TypeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nama: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nilai: string;
}

export class UpsertKonfigurasiDto {
    @ApiProperty({
        example: [
            {
                nama: 'pemasok_id',
                nilai: '1'
            },
            {
                nama: 'harga_tertinggi',
                nilai: '10000'
            },
            {
                nama: 'kondisi_jalan',
                nilai: '0'
            }
        ]
    })
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => TypeDto)
    upsert: TypeDto[];
}