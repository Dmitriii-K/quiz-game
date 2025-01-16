import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim";

export class CommentInputModel {
    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(20,300)
    content: string;
}