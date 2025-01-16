import { randomUUID } from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.typeorm.entity';

@Entity('Posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', collation: 'C', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    shortDescription: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ type: 'uuid', nullable: false })
    blogId: string;

    @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'blogId' })
    blog: Blog;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
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

