import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangeProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    namaLengkap: string;
}