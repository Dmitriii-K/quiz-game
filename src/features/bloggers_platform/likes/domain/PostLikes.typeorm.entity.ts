import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { likeStatus } from '../api/models/input.model';
import { randomUUID } from 'crypto';
import { User } from '../../../users/domain/user.typeorm.entity';
import { Post } from '../../posts/domain/post.typeorm.entity';

@Entity('PostsLikes')
export class PostLike {
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
    postId: string;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
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