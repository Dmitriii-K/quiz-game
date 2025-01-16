import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BlogService } from "../application/blog.service";
// import { BlogQueryRepository } from "../repository/blog.typeorm.query-repository";
import { BlogQueryRepository } from "../repository/blog.sql.query-repository";
import { TypeBlogHalper, TypePostForBlogHalper } from "src/base/types/blog.types";
import { PaginatorBlogViewModel } from "./models/output.model";
import { BlogInputModel, BlogPostInputModel } from "./models/input.model";
import { BlogRepository } from "../repository/blog.typeorm.repository";
import { BlogExistsPipe } from "src/infrastructure/pipes/blogExists.pipe";
import { Request, Response } from "express";
import { BasicAuthGuard } from "src/infrastructure/guards/basic.guard";
import { SoftAuthGuard } from "src/infrastructure/guards/dubl-guards/soft-auth.guard";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePostForBlogCommand } from "../application/use-cases/create-post-for-blog";
import { PostService } from "../../posts/application/post.service";
import { PostRepository } from "../../posts/repository/post.typeorm.repository";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Blogs s/a')
@ApiBasicAuth()
@Controller('sa/blogs')
export class BlogControllerSa {
    constructor(
        protected blogService: BlogService,
        protected postService: PostService,
        protected blogQueryRepository: BlogQueryRepository,
        protected blogRepository: BlogRepository,
        protected postRepository: PostRepository,
        private commandBus: CommandBus
    ) {}

    @UseGuards(BasicAuthGuard)
    @Get()//-------------
    async getAllBlogs(@Query() query: TypeBlogHalper) {
        const blogs: PaginatorBlogViewModel = await this.blogQueryRepository.getAllBlogs(query);
        return blogs;
    }

    @UseGuards(BasicAuthGuard)
    @Post()//---------------
    async createBlog(@Body() body: BlogInputModel) {
        const createResult = await this.blogService.createBlog(body);
        // console.log(createResult);//---------------------
        if (!createResult) {
            throw new NotFoundException();
        }
        const newBlog = await this.blogQueryRepository.getBlogById(createResult);
        return newBlog;
    }

    @UseGuards(SoftAuthGuard, BasicAuthGuard)
    @Get(':id/posts')//-----------------
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

    @UseGuards(BasicAuthGuard)
    @Post(':id/posts')//-----------------
    async createPostForBlog(
        @Param('id') id: string,
        @Body() body: BlogPostInputModel) {
            const findBlog = await this.blogService.findBlogById(id);
            if (!findBlog) {
                throw new NotFoundException();
            }
            // const createResult = await this.blogService.createPostForBlog(id, body, findBlog.name);
            const createResult = await this.commandBus.execute(new CreatePostForBlogCommand(id, body));
            // console.log('postId', createResult)//-----------------------
            const newPostForBlog = await this.blogQueryRepository.getPostForBlogById(createResult);
            return newPostForBlog;
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id')//-------------
    @HttpCode(204)
    async updateBlog(
        @Param('id') id: string,
        @Body() body: BlogInputModel) {
            const findBlog = await this.blogService.findBlogById(id);
            // console.log('Blog', findBlog)//--------------------------------
            if (!findBlog) {
                throw new NotFoundException();
            }
            const updateBlogResult = await this.blogService.updateBlog(id, body);
            return updateBlogResult;
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')//--------------
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {
        const deleteResult = await this.blogService.deleteBlog(id);
        if (!deleteResult) {
        throw new NotFoundException();
        }
    }

    @UseGuards(BasicAuthGuard)
    @Put(':blogId/posts/:postId')
    @HttpCode(204)//----------------
    async updatePostByIdForBlogId(
        @Param('blogId') blogId: string,
        @Param('postId') postId: string, 
        @Body() body: BlogPostInputModel) {
            const findPost = await this.postService.findPostForBlogById(blogId);
            // console.log('Post', findPost)//--------------------------------
            if (!findPost) {
                throw new NotFoundException();
            }
            const updateResult = await this.postService.updatePost(body, postId);
            if (!updateResult) {
                throw new NotFoundException();
            }
            return updateResult;
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':blogId/posts/:postId')
    @HttpCode(204)//-------------------
    async deletePostByIdForBlogId(
        @Param('blogId') blogId: string,
        @Param('postId') postId: string) {
            const findPost = await this.postService.findPostForBlogById(blogId);
            if (!findPost) {
                throw new NotFoundException();
            }
        const deleteResult = await this.postRepository.deletePost(postId);
        if (!deleteResult) {
        throw new NotFoundException();
        }
    }
}