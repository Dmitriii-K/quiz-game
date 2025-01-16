import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim";
import { BlogIsExist } from "src/infrastructure/decorators/validate/blog-is-exist.decorator";

export class PostInputModel {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(100)
    shortDescription: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    @BlogIsExist()
    blogId: string;
}