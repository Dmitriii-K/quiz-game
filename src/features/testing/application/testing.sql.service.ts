import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class TestingService {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async deleteAllData(): Promise<void> {
        const truncateUser = `
        TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE
    `;
        const truncateSessions = `
        TRUNCATE TABLE "Sessions" RESTART IDENTITY CASCADE
    `;
        const truncateBlogs = `
        TRUNCATE TABLE "Blogs" RESTART IDENTITY CASCADE
    `;
        const truncatePosts = `
        TRUNCATE TABLE "Posts" RESTART IDENTITY CASCADE
    `;
        const truncateComments = `
        TRUNCATE TABLE "Comments" RESTART IDENTITY CASCADE
    `;
        const truncatePostsLikes = `
        TRUNCATE TABLE "PostsLikes" RESTART IDENTITY CASCADE
    `;
        const truncateCommentsLikes = `
        TRUNCATE TABLE "CommentsLikes" RESTART IDENTITY CASCADE
    `;
        await this.dataSource.query(truncateUser);
        await this.dataSource.query(truncateSessions);
        await this.dataSource.query(truncateBlogs);
        await this.dataSource.query(truncatePosts);
        await this.dataSource.query(truncateComments);
        await this.dataSource.query(truncatePostsLikes);
        await this.dataSource.query(truncateCommentsLikes);
        console.log('All data of tables is deleted');
    }
}

//DELETE FROM "Users"; альтернативный но более медленный запрос не удаляет id из памяти