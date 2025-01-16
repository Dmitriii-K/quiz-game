import { Injectable } from "@nestjs/common";
import { Post } from "../domain/post.typeorm.entity";
import { BlogPostInputModel } from "../../blogs/api/models/input.model";
import { PostLike } from "../../likes/domain/PostLikes.sql.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { likeStatus } from "../../likes/api/models/input.model";

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(PostLike) private postLikeRepository: Repository<PostLike>
    ) {}

    async findPostLike(postId: string, userId: string): Promise<PostLike | null> {
        return this.postLikeRepository.findOne({ where: { postId, userId } });
    }

    async insertPostLike(like: PostLike): Promise<string> {
        const result = await this.postLikeRepository.save(like);
        return result.id;
    }

    async updatePostLikeStatus(postId: string, userId: string, updateStatus: likeStatus): Promise<boolean> {
        const result = await this.postLikeRepository.update({ postId, userId }, { likeStatus: updateStatus });
        return result.affected !== undefined && result.affected > 0;
    }

    async findPostById(postId: string): Promise<Post | null> {
        return this.postRepository.findOne({ where: { id: postId } });
    }

    async findPostForBlogById(blogId: string): Promise<Post | null> {
        return this.postRepository.findOne({ where: { blogId } });
    }

    async insertPost(post: Post): Promise<string> {
        const result = await this.postRepository.save(post);
        return result.id;
    }

    async updatePost(updatePost: BlogPostInputModel, postId: string): Promise<boolean> {
        const result = await this.postRepository.update(postId, updatePost);
        return result.affected !== undefined && result.affected > 0;
    }

    async deletePost(postId: string): Promise<boolean> {
        const result = await this.postRepository.delete(postId);
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }

    async insertPostForBlog(post: Post): Promise<string> {
        const result = await this.postRepository.save(post);
        return result.id;
    }
}