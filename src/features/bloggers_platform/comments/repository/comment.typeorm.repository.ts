import { Injectable } from "@nestjs/common";
import { Comment } from "../domain/comment.sql.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { likeStatus } from "../../likes/api/models/input.model";
import { CommentLike } from "../../likes/domain/CommentLike.typeorm.entity";


@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(CommentLike) private commentsLikeRepository: Repository<CommentLike>
    ) {}

    async updateComment(commentId: string, content: string): Promise<boolean> {
        const result = await this.commentRepository.update(commentId, { content });
        return result.affected !== undefined && result.affected > 0;
    }

    async findCommentLike(commentId: string, userId: string): Promise<CommentLike | null> {
        return this.commentsLikeRepository.findOne({ where: { commentsId: commentId, userId: userId } });
    }

    async insertCommentLike(like: CommentLike): Promise<string> {
        const result = await this.commentsLikeRepository.save(like);
        return result.id;
    }

    async updateCommentLikeStatus(commentsId: string, userId: string, updateStatus: likeStatus): Promise<boolean> {
        const result = await this.commentsLikeRepository.update({ commentsId, userId }, { likeStatus: updateStatus });
        return result.affected !== undefined && result.affected > 0;
    }

    async findComment(commentId: string): Promise<Comment | null> {
        return this.commentRepository.findOne({ where: { id: commentId } });
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const result = await this.commentRepository.delete(commentId);
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }

    async insertComment(comment: Comment): Promise<string> {
        const result = await this.commentRepository.save(comment);
        return result.id;
    }
}