import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

class OrderDto {
    @ApiPropertyOptional({ enum: ['nama', 'deskripsi', 'tanggalMulai', 'tanggalSelesai', 'status'] })
    @IsOptional()
    @IsEnum(['nama', 'deskripsi', 'tanggalMulai', 'tanggalSelesai', 'status'])
    index: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order: string;
}

export class QueryEventDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value == 'string' ? parseInt(value) : value)
    offset?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => typeof value == 'string' ? parseInt(value) : value)
    limit?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => typeof value == 'string' ? JSON.parse(value) : value)
    @Type(() => OrderDto)
    order?: OrderDto;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}