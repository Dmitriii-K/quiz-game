import { Controller, Get, NotFoundException, Param, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BlogService } from "../application/blog.service";
// import { BlogQueryRepository } from "../repository/blog.typeorm.query-repository";
import { BlogQueryRepository } from "../repository/blog.sql.query-repository";
import { TypeBlogHalper, TypePostForBlogHalper } from "src/base/types/blog.types";
import { PaginatorBlogViewModel } from "./models/output.model";
import { BlogRepository } from "../repository/blog.typeorm.repository";
import { BlogExistsPipe } from "src/infrastructure/pipes/blogExists.pipe";
import { Request, Response } from "express";
import { SoftAuthGuard } from "src/infrastructure/guards/dubl-guards/soft-auth.guard";
import { PostService } from "../../posts/application/post.service";
import { PostRepository } from "../../posts/repository/post.typeorm.repository";


@Controller('blogs')
export class BlogController {
    constructor(
        protected blogService: BlogService,
        protected postService: PostService,
        protected blogQueryRepository: BlogQueryRepository,
        protected blogRepository: BlogRepository,
        protected postRepository: PostRepository
    ) {}

    @Get()//-----------
    async getAllBlogs(@Query() query: TypeBlogHalper) {
        const blogs: PaginatorBlogViewModel = await this.blogQueryRepository.getAllBlogs(query);
        return blogs;
    }

    @UseGuards(SoftAuthGuard)
    @Get(':id/posts')//-------------
    async getPostsForBlog(
        @Query() query: TypePostForBlogHalper,
        @Param('id', BlogExistsPipe) id: string,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
            const userId: string | null = req.user ? req.user.userId : null;
            const posts = await this.blogQueryRepository.getPostsForBlog(query, id, userId);
            if(!posts) {
                throw new NotFoundException();
            }
            return posts;
    }

    @Get(':id')//---------------
    async getBlogById(@Param('id') id: string) {
        const blogResult = await this.blogQueryRepository.getBlogById(id);
        if (!blogResult) {
            throw new NotFoundException();
        }
        return blogResult;
    }
}