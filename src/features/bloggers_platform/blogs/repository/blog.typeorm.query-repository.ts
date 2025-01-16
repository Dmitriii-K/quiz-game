import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.typeorm.entity';
import { Post } from '../../posts/domain/post.typeorm.entity';
import { PostLike } from '../../likes/domain/PostLikes.typeorm.entity';
import { TypeBlogHalper, TypePostForBlogHalper } from 'src/base/types/blog.types';
import { blogMap, BlogViewModel, PaginatorBlogViewModel } from '../api/models/output.model';
import { blogPagination } from 'src/base/models/blog.model';
import { mapPost, PaginatorPostViewModel, PostViewModel } from '../../posts/api/models/output.model';

@Injectable()
export class BlogQueryRepository {
    constructor(
        @InjectRepository(Blog) private blogRepository: Repository<Blog>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(PostLike) private postsLikesRepository: Repository<PostLike>
    ) {}

    async getAllBlogs(helper: TypeBlogHalper): Promise<PaginatorBlogViewModel> {
        const queryParams = blogPagination(helper);

        const queryBuilder = this.blogRepository.createQueryBuilder('blog');

        if (helper.searchNameTerm) {
            queryBuilder.andWhere('blog.name ILIKE :searchNameTerm', { searchNameTerm: `%${helper.searchNameTerm}%` });
        }

        queryBuilder
            .orderBy(`blog.${queryParams.sortBy}`, queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC')
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .take(queryParams.pageSize);

        const [blogs, totalCount] = await queryBuilder.getManyAndCount();

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: blogs.map(blogMap),
        };
    }

    async getBlogById(blogId: string): Promise<BlogViewModel | null> {
        const blog = await this.blogRepository.findOne({ where: { id: blogId } });

        if (!blog) {
            return null;
        }

        return blogMap(blog);
    }

    async getPostForBlogById(postId: string): Promise<PostViewModel | null> {
        const post = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.blog', 'blog')
            .leftJoin('post.likes', 'likes')
            .leftJoin('post.likes', 'userLike', 'userLike.userId = :userId', { userId: 'currentUserId' })
            .select([
                'post.id',
                'post.title',
                'post.shortDescription',
                'post.content',
                'post.blogId',
                'blog.name',
                'post.createdAt',
                'COUNT(CASE WHEN likes.likeStatus = \'Like\' THEN 1 END) AS likesCount',
                'COUNT(CASE WHEN likes.likeStatus = \'Dislike\' THEN 1 END) AS dislikesCount',
                'COALESCE(userLike.likeStatus, \'None\') AS userLikeStatus',
            ])
            .where('post.id = :postId', { postId })
            .groupBy('post.id, blog.name, userLike.likeStatus')
            .getRawOne();

        if (!post) {
            return null;
        }

        const newestLikes = await this.postsLikesRepository
            .createQueryBuilder('likes')
            .leftJoinAndSelect('likes.user', 'user')
            .where('likes.postId = :postId', { postId })
            .andWhere('likes.likeStatus = \'Like\'')
            .orderBy('likes.createdAt', 'DESC')
            .limit(3)
            .getMany();

        return mapPost(post, newestLikes);
    }

    async getPostsForBlog(helper: TypePostForBlogHalper, id: string, userId: string | null): Promise<PaginatorPostViewModel> {
        const queryParams = blogPagination(helper);

        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.blog', 'blog')
            .leftJoin('post.likes', 'likes')
            .leftJoin('post.likes', 'userLike', 'userLike.userId = :userId', { userId })
            .select([
                'post.id',
                'post.title',
                'post.shortDescription',
                'post.content',
                'post.blogId',
                'blog.name',
                'post.createdAt',
                'COUNT(CASE WHEN likes.likeStatus = \'Like\' THEN 1 END) AS likesCount',
                'COUNT(CASE WHEN likes.likeStatus = \'Dislike\' THEN 1 END) AS dislikesCount',
                'COALESCE(userLike.likeStatus, \'None\') AS userLikeStatus',
            ])
            .where('post.blogId = :id', { id })
            .groupBy('post.id, blog.name, userLike.likeStatus')
            .orderBy(`post.${queryParams.sortBy}`, queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC')
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .take(queryParams.pageSize);

        const [posts, totalCount] = await queryBuilder.getManyAndCount();

        const items = await Promise.all(posts.map(async post => {
            const newestLikes = await this.postsLikesRepository
                .createQueryBuilder('likes')
                .leftJoinAndSelect('likes.user', 'user')
                .where('likes.postId = :postId', { postId: post.id })
                .andWhere('likes.likeStatus = \'Like\'')
                .orderBy('likes.createdAt', 'DESC')
                .limit(3)
                .getMany();

            return mapPost(post, newestLikes);
        }));

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items,
        };
    }
}