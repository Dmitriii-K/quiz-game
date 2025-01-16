import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity()
export class Comment {
@PrimaryColumn('uuid')
id: string;

@Column({ type: 'text', nullable: false })
content: string;

@CreateDateColumn()
createdAt: Date;

@Column({ type: 'uuid', nullable: false })
postId: string;

@Column({ type: 'uuid', nullable: false })
userId: string;

    static createComment(postId: string, userId: string, content: string): Comment {
        const comment = new Comment();

        comment.id = randomUUID();
        comment.content = content;
        comment.createdAt = new Date();
        comment.postId = postId;
        comment.userId = userId;

        return comment;
    }
}