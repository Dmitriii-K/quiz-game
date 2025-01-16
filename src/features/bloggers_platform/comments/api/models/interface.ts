// import { UserDBModel } from "src/base/types/user.types";
// import { CommentViewModel } from "./output.model";
// import { CommentDBType } from "src/base/types/comment.types";
// import { CommentDocument } from "../../domain/comment.entity";
// import { likeStatus, LikesType } from "src/features/bloggers_platform/likes/api/models/input.model";

// export interface ICommentService {
//     findUserByComment(commentId: string): Promise<CommentDBType | null>;
//     updateComment(commentId: string, content: string): Promise<boolean>;
//     likeStatus(user: CommentDocument, data: likeStatus, comment: CommentViewModel): Promise<boolean>;
//     deleteComment(commentId: string): Promise<boolean>;
// }

// export interface ICommentQueryRepository {
//     findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null>;
//     mapComment(comment: CommentDocument, userLikeStatus?: likeStatus): CommentViewModel;
// }

// export interface ICommentRepository {
//     findUserByComment(id: string): Promise<CommentDocument | null>;
//     updateComment(id: string, content: string): Promise<boolean>;
//     findAllLikesForPost(postId: string): Promise<LikesType[]>;
//     findLike(commentId: string, userId: string): Promise<LikesType | null>;
//     insertLike(like: LikesType): Promise<string>;
//     updateLikesInfo(commentId: string, likesCount: number, dislikesCount: number): Promise<void>;
//     updateLikeStatus(commentId: string, status: likeStatus): Promise<boolean>;
//     deleteComment(id: string): Promise<boolean>;
// }