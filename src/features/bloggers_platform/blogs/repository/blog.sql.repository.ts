import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Blog } from '../domain/blog.sql.entity';
import { BlogInputModel, BlogPostInputModel } from '../api/models/input.model';

@Injectable()
export class BlogRepository {
    constructor(private dataSource: DataSource) {}

    async insertBlog(blog: Blog): Promise<string> {
        const query = `
            INSERT INTO "Blogs" (id, name, description, "websiteUrl", "createdAt", "isMembership")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            blog.id,
            blog.name,
            blog.description,
            blog.websiteUrl,
            blog.createdAt,
            blog.isMembership
        ]);
        return result[0].id;
    }

    async findBlogById(blogId: string): Promise<Blog | null> {
        const query = `SELECT * FROM "Blogs" WHERE id = $1`;
        const result = await this.dataSource.query(query, [blogId]);
        return result.length ? result[0] : null;
    }

    async updateBlog(blogId: string, updateContent: BlogInputModel): Promise<boolean> {
        const query = `
            UPDATE "Blogs"
            SET name = $1, description = $2, "websiteUrl" = $3
            WHERE id = $4
        `;
        const result = await this.dataSource.query(query, [
            updateContent.name,
            updateContent.description,
            updateContent.websiteUrl,
            blogId
        ]);
        return !!result[1];
    }

    async updatePostForBlog(blogId: string, updateContent: BlogPostInputModel): Promise<boolean> {
        const query = `
            UPDATE "Blogs"
            SET title = $1, "shortDescription" = $2, content = $3
            WHERE id = $4
        `;
        const result = await this.dataSource.query(query, [
            updateContent.title,
            updateContent.shortDescription,
            updateContent.content,
            blogId
        ]);
        return !!result[1];
    }

    async deletePostForBlog(blogId: string): Promise<boolean> {
        const query = `DELETE FROM "Blogs" WHERE id = $1`;
        const result = await this.dataSource.query(query, [blogId]);
        return !!result[1];
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        const query = `DELETE FROM "Blogs" WHERE id = $1`;
        const result = await this.dataSource.query(query, [blogId]);
        return !!result[1];
    }

    async blogIsExist(id: string): Promise<boolean> {
        const query = `SELECT COUNT(*) FROM "Blogs" WHERE id = $1`;
        const result = await this.dataSource.query(query, [id]);
        return result[0].count > 0;
    }

    async findBlogNameForId(blogId: string): Promise<Blog | null> {
        const query = `SELECT * FROM "Blogs" WHERE id = $1`;
        const result = await this.dataSource.query(query, [blogId]);
        return result.length ? result[0] : null;
    }
}