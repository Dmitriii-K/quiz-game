import { Module } from "@nestjs/common";
import { TestingController } from "./api/testing.controller";
import { TestingService } from "./application/testing.typeorm.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/domain/user.typeorm.entity";
import { Session } from "../sessions/domain/session.typeorm.entity";
import { Blog } from "../bloggers_platform/blogs/domain/blog.typeorm.entity";
import { Post } from "../bloggers_platform/posts/domain/post.typeorm.entity";
import { Comment } from "../bloggers_platform/comments/domain/comment.typeorm.entity";
import { CommentLike } from "../bloggers_platform/likes/domain/CommentLike.typeorm.entity";
import { PostLike } from "../bloggers_platform/likes/domain/PostLikes.typeorm.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Session, Blog, Post, Comment, CommentLike, PostLike])
    ],
    controllers: [TestingController],
    providers: [TestingService],
    exports: []
})
export class TestingsModule {
}