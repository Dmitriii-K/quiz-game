import { CommentatorInfo } from "src/base/types/comment.types";
import { likeStatus } from "src/features/bloggers_platform/likes/api/models/input.model";

export class CommentViewModel {
    id:string;
    content:	string;
    createdAt:	string;
    commentatorInfo: CommentatorInfo;
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: likeStatus
    }
}

export class PaginatorCommentViewModelDB {
    pagesCount:	number;
    page:	number;
    pageSize:	number;
    totalCount:	number;
    items: CommentViewModel[];
}

export function mapComment(comment: any): CommentViewModel {
    return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin,
        },
        likesInfo: {
            likesCount: parseInt(comment.likesCount, 10) || 0,
            dislikesCount: parseInt(comment.dislikesCount, 10) || 0,
            myStatus: comment.userLikeStatus,
        },
    };
}