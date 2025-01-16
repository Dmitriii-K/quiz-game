import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { likeStatus } from '../api/models/input.model';
import { randomUUID } from 'crypto';
import { User } from '../../../users/domain/user.typeorm.entity';
import { Comment } from '../../comments/domain/comment.typeorm.entity';

@Entity('CommentsLikes')
export class CommentLike {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    likeStatus: string;

    @Column({ type: 'uuid', nullable: false })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid', nullable: false })
    commentsId: string;

    @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentsId' })
    comment: Comment;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    static createCommentLike(userId: string, commentsId: string, status: likeStatus): CommentLike {
        const like = new CommentLike();
    
        like.id = randomUUID();
        like.likeStatus = status || likeStatus.None;
        like.userId = userId,
        like.commentsId = commentsId,
        like.createdAt = new Date();
    
        return like;
    }
}