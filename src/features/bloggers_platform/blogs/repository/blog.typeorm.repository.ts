import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.typeorm.entity';
import { BlogInputModel, BlogPostInputModel } from '../api/models/input.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../posts/domain/post.typeorm.entity';


@Injectable()
export class BlogRepository {
    constructor(
        @InjectRepository(Blog) private blogRepository: Repository<Blog>,
        @InjectRepository(Blog) private postRepository: Repository<Post>,
    ) {}

    async insertBlog(blog: Blog): Promise<string> {
        const result = await this.blogRepository.save(blog);
        return result.id;
    }

    async findBlogById(blogId: string): Promise<Blog | null> {
        return this.blogRepository.findOne({ where: { id: blogId } });
    }

    async updateBlog(blogId: string, updateContent: BlogInputModel): Promise<boolean> {
        const result = await this.blogRepository.update(blogId, updateContent);
        // console.log('result', result)//--------------------------------
        return result.affected !== undefined && result.affected > 0;
    }

    async updatePostForBlog(blogId: string, updateContent: BlogPostInputModel): Promise<boolean> {
        const result = await this.postRepository.update(blogId, updateContent);
        return result.affected !== undefined && result.affected > 0;
    }

    // async deletePostForBlog(blogId: string): Promise<boolean> {
    //     const result = await this.blogRepository.delete(blogId);
    //     return result.affected !== undefined && result.affected !== null && result.affected > 0;
    // }

    async deleteBlog(blogId: string): Promise<boolean> {
        const result = await this.blogRepository.delete(blogId);
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }

    async blogIsExist(id: string): Promise<boolean> {
        const count = await this.blogRepository.count({ where: { id } });
        return count > 0;
    }

    async findBlogNameForId(blogId: string): Promise<Blog | null> {
        return this.blogRepository.findOne({ where: { id: blogId } });
    }
}