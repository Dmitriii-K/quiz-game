import { Injectable } from "@nestjs/common";
import { BlogRepository } from "../repository/blog.typeorm.repository";
import { BlogInputModel, BlogPostInputModel } from "../api/models/input.model";
import { Blog } from "../domain/blog.typeorm.entity";


@Injectable()
export class BlogService {
    constructor(protected blogRepository: BlogRepository) {}

    async createBlog(data: BlogInputModel) {
        const newBlog: Blog = Blog.createBlog(data.name, data.description, data.websiteUrl);
        return this.blogRepository.insertBlog(newBlog);
    }

    async findBlogById(id: string) {
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog) {
            return null;
        } else {
            return blog;
        }
    }

    async updateBlog(id: string, updateContent: BlogInputModel) {
        const updateResult = await this.blogRepository.updateBlog(id, updateContent);
        if (updateResult) {
            return updateResult;
        } else {
            return false;
        }
    }

    async updatePostByIdForBlogId(postId: string,  updateContent: BlogPostInputModel) {
        const updateResult = await this.blogRepository.updatePostForBlog(postId, updateContent);
        if (updateResult) {
            return updateResult;
        } else {
            return false;
        }
    }

    async deletePostByIdForBlogId(postId: string) {
        const deleteResult = await this.blogRepository.deleteBlog(postId);
        if (deleteResult) {
            return true;
        } else {
            return false;
        }
    }

    async deleteBlog(id: string) {
        const deleteResult = await this.blogRepository.deleteBlog(id);
        if (deleteResult) {
            return true;
        } else {
            return false;
        }
    }
}