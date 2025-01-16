import { PostRepository } from "../../repository/post.typeorm.repository";
import { MeViewModel } from "src/features/auth/api/models/output.model";
import { CommandHandler } from "@nestjs/cqrs";
import { CommentInputModel } from "src/features/bloggers_platform/comments/api/models/input.model";
import { NotFoundException } from "@nestjs/common";
import { Comment } from "src/features/bloggers_platform/comments/domain/comment.sql.entity";
import { CommentRepository } from "src/features/bloggers_platform/comments/repository/comment.typeorm.repository";

export class CreateCommentByPostCommand {
    constructor(
        public postId: string,
        public body: CommentInputModel,
        public user: MeViewModel
        ) {}
}

@CommandHandler(CreateCommentByPostCommand)
export class CreateCommentByPostUseCase {
    constructor(
        private postRepository: PostRepository,
        private commentRepository: CommentRepository,
    ) {}

    async execute(command: CreateCommentByPostCommand) {
        const {postId, body, user} = command;
        const post = await this.postRepository.findPostById(postId);
        if(!post) {
            throw new NotFoundException()
        }
        const newComment: Comment = Comment.createComment(postId, user.userId, body.content)
        return this.commentRepository.insertComment(newComment);
    }
}