import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class QueryKonfigurasiDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    nama: string[];
}