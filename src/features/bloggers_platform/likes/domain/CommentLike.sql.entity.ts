import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { likeStatus } from '../api/models/input.model';
import { randomUUID } from 'crypto';

@Entity()
export class CommentsLike {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: likeStatus, nullable: false, default: likeStatus.None })
    likeStatus: likeStatus;

    @Column({ type: 'uuid', nullable: false })
    userId: string;

    @Column({ type: 'uuid', nullable: false })
    commentsId: string;

    @CreateDateColumn()
    createdAt: Date;

    static createCommentLike(userId: string, commentsId: string, status: likeStatus): CommentsLike {
        const like = new CommentsLike();

        like.id = randomUUID();
        like.likeStatus = status || likeStatus.None;
        like.userId = userId,
        like.commentsId = commentsId,
        like.createdAt = new Date();

        return like;
    }
}