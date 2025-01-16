import { LikesCount } from "src/features/bloggers_platform/likes/api/models/input.model";

export class CommentatorInfo {
    userId:	string;
    userLogin:	string;
}

export class CommentDBType {
    postId?: string;
    content:	string;
    createdAt:	string;
    commentatorInfo: CommentatorInfo;
    likesInfo: LikesCount
}