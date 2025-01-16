// import { CommentInputModel } from "src/features/bloggers_platform/comments/api/models/input.model";
// import { PostInputModel } from "./input.model";
// import { UserDocument } from "src/features/users/domain/user.entity";
// import { PostDocument } from "../../domain/post.entity";
// import { PaginatorPostViewModel, PostViewModel } from "./output.model";
// import { CommentViewModel } from "src/features/bloggers_platform/comments/api/models/output.model";
// import { TypePostHalper } from "src/base/types/post.types";
// import { CommentDocument } from "src/features/bloggers_platform/comments/domain/comment.entity";
// import { BlogDocument } from "src/features/bloggers_platform/blogs/domain/blog.entity";
// import { likeStatus, LikesType } from "src/features/bloggers_platform/likes/api/models/input.model";

// export interface IPostService {
//     createPost(post: PostInputModel, blogId: string): Promise<string | null>;
//     createCommentByPost(postId: string, comment: CommentInputModel, user: UserDocument): Promise<string | null>;
//     getPostById(postId: string): Promise<PostDocument | null>;
//     updatePostLike(user: UserDocument, data: likeStatus, post: PostDocument): Promise<boolean>;
//     updatePost(post: PostInputModel, postId: string): Promise<boolean>;
//     deletePost(postId: string): Promise<boolean>;
// }

// export interface IPostQueryRepository {
//     findPostById(postId: string, userId: string | null): Promise<PostViewModel | null>;
//     findCommentById(commentId: string): Promise<CommentViewModel | null>;
//     getAllPosts(query: TypePostHalper, user: UserDocument | null): Promise<PaginatorPostViewModel>;
//     findCommentByPost(query: TypePostHalper, postId: string, userId: string | null): Promise<PaginatorPostViewModel>;
//     mapPost(post: PostDocument, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel;
//     mapComment(comment: CommentDocument, userLikeStatus?: likeStatus): CommentViewModel;
// }

// export interface IPostRepository {
//     findBlogNameForId(id: string): Promise<BlogDocument | null>;
//     insertPost(post: PostDocument): Promise<string>;
//     findPostById(postId: string): Promise<PostDocument | null>;
//     updatePost(data: PostInputModel, id: string): Promise<boolean>;
//     deletePost(id: string): Promise<boolean>;
//     insertComment(comment: CommentDocument): Promise<string>;
//     updatePostCount(postId: string, likesCount: number, dislikesCount: number): Promise<boolean>;
// }

// export interface ICommentRepository {
//     findLike(commentId: string, userId: string): Promise<LikesType | null>;
//     insertLike(like: LikesType): Promise<string>;
//     updateLikeStatus(commentId: string, status: likeStatus): Promise<boolean>;
//     findAllLikesForPost(postId: string): Promise<LikesType[]>;
// }