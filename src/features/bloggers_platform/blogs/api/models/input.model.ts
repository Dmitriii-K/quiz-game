import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim";

export class BlogInputModel {
    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(15)
    name: string;

    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(500)
    description: string;

    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    @Length(1,100)
    websiteUrl: string;
}

export class BlogPostInputModel {
    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(100)
    shortDescription: string;

    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;
}