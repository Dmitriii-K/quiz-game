import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../posts/domain/post.typeorm.entity';
import { PostLike } from '../../likes/domain/PostLikes.typeorm.entity';
import { Comment } from '../../comments/domain/comment.typeorm.entity';
import { TypePostHalper } from 'src/base/types/post.types';
import { mapPost, PaginatorPostViewModel, PostViewModel } from '../api/models/output.model';
import { postPagination } from 'src/base/models/post.model';
import { commentsPagination } from 'src/base/models/comment.model';
import { mapComment, PaginatorCommentViewModelDB } from '../../comments/api/models/output.model';

@Injectable()
export class PostQueryRepository {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(PostLike) private postsLikesRepository: Repository<PostLike>,
        @InjectRepository(Comment) private commentRepository: Repository<Comment>
    ) {}

    async getAllPosts(helper: TypePostHalper, userId: string | null): Promise<PaginatorPostViewModel> {
        const queryParams = postPagination(helper);

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

    async findPostById(postId: string, userId: string | null): Promise<PostViewModel | null> {
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
            .where('post.id = :postId', { postId })
            .groupBy('post.id, blog.name, userLike.likeStatus');

        const post = await queryBuilder.getRawOne();

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

    async findCommentByPost(helper: TypePostHalper, postId: string, userId: string | null): Promise<PaginatorCommentViewModelDB> {
        const queryParams = commentsPagination(helper);

        const queryBuilder = this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoin('comment.likes', 'likes')
            .leftJoin('comment.likes', 'userLike', 'userLike.userId = :userId', { userId })
            .select([
                'comment.id',
                'comment.content',
                'comment.createdAt',
                'user.id',
                'user.login',
                'COUNT(CASE WHEN likes.likeStatus = \'Like\' THEN 1 END) AS likesCount',
                'COUNT(CASE WHEN likes.likeStatus = \'Dislike\' THEN 1 END) AS dislikesCount',
                'COALESCE(userLike.likeStatus, \'None\') AS userLikeStatus',
            ])
            .where('comment.postId = :postId', { postId })
            .groupBy('comment.id, user.id, user.login, userLike.likeStatus')
            .orderBy(`comment.${queryParams.sortBy}`, queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC')
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .take(queryParams.pageSize);

        const [comments, totalCount] = await queryBuilder.getManyAndCount();

        const items = comments.map(comment => mapComment(comment));

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items,
        };
    }
}