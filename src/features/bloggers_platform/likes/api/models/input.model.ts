import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim";

export enum likeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}
export class LikeStatusDto {
    @ApiProperty()
    @IsNotEmpty()
    @Trim()
    @IsEnum(likeStatus)
    likeStatus = likeStatus.None;
}

export class LikesType {
    addedAt: string;
    commentId: string;
    userId: string;
    userLogin: string;
    status: likeStatus
}

export class LikesCount {
    likesCount: number;
    dislikesCount: number;
}

export class NewestLikesType {
    addedAt: string;
    userId: string;
    login: string
}