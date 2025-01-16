import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { BlogRepository } from 'src/features/bloggers_platform/blogs/repository/blog.typeorm.repository';

@Injectable()
export class BlogExistsPipe implements PipeTransform {
    constructor(
    protected blogRepository: BlogRepository
    ) {}
async transform(value: string, { metatype }: ArgumentMetadata) {
    const foundBlog = await this.blogRepository.findBlogById(value)
    if (!foundBlog) {
        throw new NotFoundException('blog is not exists');
    }
    return value;
}
}