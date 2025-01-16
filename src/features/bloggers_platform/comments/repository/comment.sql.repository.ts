import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Comment } from "../domain/comment.sql.entity";
import { CommentsLike } from "../../likes/domain/CommentLike.sql.entity";

@Injectable()
export class CommentRepository {
    constructor(private dataSource: DataSource) {}

    async updateComment(commentId: string, content: string): Promise<boolean> {
        const query = `
            UPDATE "Comments"
            SET content = $1
            WHERE id = $2
        `;
        const result = await this.dataSource.query(query, [content, commentId]);
        return result.rowCount === 1;
    }

    async findCommentLike(commentId: string, userId: string): Promise<CommentsLike | null> {
        const query = `
            SELECT * FROM "CommentsLikes"
            WHERE "commentsId" = $1 AND "userId" = $2
        `;
        const result = await this.dataSource.query(query, [commentId, userId]);
        return result.length ? result[0] : null;
    }

    async insertCommentLike(like: CommentsLike): Promise<string> {
        const query = `
            INSERT INTO "CommentsLikes" (id, "likeStatus", "userId", "commentsId", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [like.id, like.likeStatus, like.userId, like.commentsId, like.createdAt]);
        return result[0].id;
    }

    async updateCommentLikeStatus(commentsId: string, userId: string, updateStatus: string): Promise<boolean> {
        const query = `
            UPDATE "CommentsLikes"
            SET "likeStatus" = $1
            WHERE "commentsId" = $2 AND "userId" = $3
        `;
        const result = await this.dataSource.query(query, [updateStatus, commentsId, userId]);
        return result.rowCount === 1;
    }

    async findComment(commentId: string): Promise<Comment | null> {
        const query = `
            SELECT * FROM "Comments"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [commentId]);
        return result.length ? result[0] : null;
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const query = `
            DELETE FROM "Comments"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [commentId]);
        return result.rowCount === 1;
    }

    async insertComment(comment: Comment): Promise<string> {
        const query = `
            INSERT INTO "Comments" (id, content, "createdAt", "postId", "userId")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            comment.id,
            comment.content,
            comment.createdAt,
            comment.postId,
            comment.userId
        ]);
        return result[0].id;
    }
}