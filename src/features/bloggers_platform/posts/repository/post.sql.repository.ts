import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Post } from "../domain/post.typeorm.entity";
import { BlogPostInputModel } from "../../blogs/api/models/input.model";
import { PostLike } from "../../likes/domain/PostLikes.sql.entity";

@Injectable()
export class PostRepository {
    constructor(private dataSource: DataSource) {}

    async findPostLike(postId: string, userId: string): Promise<PostLike | null> {
        const query = `
            SELECT * FROM "PostsLikes"
            WHERE "postId" = $1 AND "userId" = $2
        `;
        const result = await this.dataSource.query(query, [postId, userId]);
        return result.length ? result[0] : null;
    }

    async insertPostLike(like: PostLike): Promise<string> {
        // console.log(like);//--------------------
        const query = `
            INSERT INTO "PostsLikes" (id, "likeStatus", "userId", "postId", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [like.id, like.likeStatus, like.userId, like.postId, like.createdAt]);
        return result[0].id;
    }

    async updatePostLikeStatus(postId: string, userId: string, updateStatus: string): Promise<boolean> {
        const query = `
            UPDATE "PostsLikes"
            SET "likeStatus" = $1
            WHERE "postId" = $2 AND "userId" = $3
        `;
        const result = await this.dataSource.query(query, [updateStatus, postId, userId]);
        return result.rowCount === 1;
    }

    async findPostById(postId: string): Promise<Post | null> {
        const query = `SELECT * FROM "Posts" WHERE id = $1`;
        const result = await this.dataSource.query(query, [postId]);
        return result.length ? result[0] : null;
    }

    async findPostForBlogById(blogId: string): Promise<Post | null> {
        const query = `SELECT * FROM "Posts" WHERE "blogId" = $1`;
        const result = await this.dataSource.query(query, [blogId]);
        return result.length ? result[0] : null;
    }

    async insertPost(post: Post): Promise<string> {
        const query = `
            INSERT INTO "Posts" (id, title, "shortDescription", content, "blogId", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.createdAt
        ]);
        return result[0].id;
    }

    async updatePost(post: BlogPostInputModel, postId: string): Promise<boolean> {
        const query = `
            UPDATE "Posts"
            SET title = $1, "shortDescription" = $2, content = $3
            WHERE id = $4
        `;
        const result = await this.dataSource.query(query, [
            post.title,
            post.shortDescription,
            post.content,
            postId
        ]);
        return !!result[1];
    }

    async deletePost(postId: string): Promise<boolean> {
        const query = `DELETE FROM "Posts" WHERE id = $1`;
        const result = await this.dataSource.query(query, [postId]);
        return !!result[1];
    }

    async insertPostForBlog(post: Post): Promise<string> {
        const query = `
            INSERT INTO "Posts" (id, title, "shortDescription", content, "blogId", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.createdAt
        ]);
        return result[0].id;// blogId ???
    }
}