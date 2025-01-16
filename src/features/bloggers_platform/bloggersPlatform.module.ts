import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { BlogController } from "./blogs/api/blog.controller";
import { BlogService } from "./blogs/application/blog.service";
import { BlogRepository } from "./blogs/repository/blog.typeorm.repository";
// import { BlogQueryRepository } from "./blogs/repository/blog.typeorm.query-repository";
import { BlogQueryRepository } from "./blogs/repository/blog.sql.query-repository";
import { CommentController } from "./comments/api/comment.controller";
import { CommentService } from "./comments/application/comment.service";
import { CommentRepository } from "./comments/repository/comment.typeorm.repository";
import { CommentQueryRepository } from "./comments/repository/comment.sql.query-repository";
// import { CommentQueryRepository } from "./comments/repository/comment.typeorm.query-repository";
import { PostController } from "./posts/api/post.controller";
import { PostService } from "./posts/application/post.service";
import { PostRepository } from "./posts/repository/post.typeorm.repository";
// import { PostQueryRepository } from "./posts/repository/post.typeorm.query-repository";
import { PostQueryRepository } from "./posts/repository/post.sql.query-repository";
import { CoreModule } from "src/infrastructure/core.module";
import { UsersModule } from "../users/users.module";
import { BlogControllerSa } from "./blogs/api/blog.controller-sa";
import { LikeStatusUseCase } from "./comments/application/use-cases/like-status";
import { CreatePostForBlogUseCase } from "./blogs/application/use-cases/create-post-for-blog";
import { CreateCommentByPostUseCase } from "./posts/application/use-cases/create-comment-by-post";
import { CreatePostUseCase } from "./posts/application/use-cases/create-post";
import { UpdatePostLikeUseCase } from "./posts/application/use-cases/sql-update-post-like";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "./blogs/domain/blog.typeorm.entity";
import { Post } from "./posts/domain/post.typeorm.entity";
import { Comment } from "./comments/domain/comment.typeorm.entity";
import { CommentLike } from "./likes/domain/CommentLike.typeorm.entity";
import { PostLike } from "./likes/domain/PostLikes.typeorm.entity";

@Module({
    imports: [
        CqrsModule,
        UsersModule,
        CoreModule,
        TypeOrmModule.forFeature([Blog, Post, Comment, CommentLike, PostLike])
    ],
    controllers: [BlogController, BlogControllerSa, CommentController, PostController],
    providers: [
        BlogService, BlogRepository, BlogQueryRepository, 
        CommentService, CommentRepository, CommentQueryRepository, 
        PostService, PostRepository, PostQueryRepository,
        LikeStatusUseCase, UpdatePostLikeUseCase, CreateCommentByPostUseCase, 
        CreatePostUseCase, CreatePostForBlogUseCase
    ],
    exports: [BlogRepository, PostRepository, CommentRepository, BlogRepository]
})
export class BloggersPlatformModule {
}