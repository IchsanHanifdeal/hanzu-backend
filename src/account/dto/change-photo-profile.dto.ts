import { ApiProperty } from "@nestjs/swagger";

export class ChangePhotoProfileDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true
    })
    gambar: Express.Multer.File;
}