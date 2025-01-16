import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../comments/domain/comment.typeorm.entity';
import { CommentViewModel, mapComment } from '../api/models/output.model';

@Injectable()
export class CommentQueryRepository {
    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>
    ) {}

    async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
        const queryBuilder = this.commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('comment.users', 'users')
            .leftJoin('comments.CommentsLikes', 'CommentsLikes')
            .leftJoin('comment.CommentsLikes', 'CommentsLikes', 'CommentsLikes.userId = :userId', { userId })
            .select([
                'comments.id',
                'comments.content',
                'comments.createdAt',
                'users.id AS userId', // Добавляем алиас userId
                'users.login AS userLogin', // Добавляем алиас userLogin
                'COUNT(CASE WHEN CommentsLikes.likeStatus = \'Like\' THEN 1 END) AS likesCount',
                'COUNT(CASE WHEN CommentsLikes.likeStatus = \'Dislike\' THEN 1 END) AS dislikesCount',
                'COALESCE(CommentsLikes.likeStatus, \'None\') AS userLikeStatus',
            ])
            .where('comments.id = :commentId', { commentId })
            .groupBy('comments.id, comments.content, comments.createdAt, users.id, users.login, CommentsLikes.likeStatus');

        const comment = await queryBuilder.getRawOne();

        if (!comment) {
            return null;
        }

        return mapComment(comment);
    }
}