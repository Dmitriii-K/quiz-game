import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { likeStatus } from '../api/models/input.model';
import { randomUUID } from 'crypto';

@Entity()
export class PostLike {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: likeStatus, nullable: false, default: likeStatus.None })
    likeStatus: likeStatus;

    @Column({ type: 'uuid', nullable: false })
    userId: string;

    @Column({ type: 'uuid', nullable: false })
    postId: string;

    @CreateDateColumn()
    createdAt: Date;

    static createPostLike(userId: string, postId: string, status: likeStatus): PostLike {
        const like = new PostLike();

        like.id = randomUUID();
        like.likeStatus = status || likeStatus.None;
        like.userId = userId,
        like.postId = postId,
        like.createdAt = new Date();

        return like;
    }
}