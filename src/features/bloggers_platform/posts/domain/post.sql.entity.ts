import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity()
export class Post {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    shortDescription: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ type: 'uuid', nullable: false })
    blogId: string;

    @CreateDateColumn()
    createdAt: Date;

    static createPost(title: string, shortDescription: string, content: string, blogId: string): Post {
        const post = new Post();
        
        post.id = randomUUID();
        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        post.blogId = blogId;
        post.createdAt = new Date();

        return post;
    }
}