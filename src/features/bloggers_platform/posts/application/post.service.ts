import { Injectable } from "@nestjs/common";
import { PostRepository } from "../repository/post.typeorm.repository";
import { Post } from "../domain/post.typeorm.entity";
import { BlogPostInputModel } from "../../blogs/api/models/input.model";

@Injectable()
export class PostService {
    constructor(private postRepository: PostRepository) {}

    async updatePost(body: BlogPostInputModel, id: string) {
        const succsesUpdate = await this.postRepository.updatePost(body, id);
        if (succsesUpdate) {
            return succsesUpdate;
        } else {
            return false;
        }
    }

    async getPostById(postId: string) {
        return this.postRepository.findPostById(postId);
    }

    async findPostById(postId: string): Promise<Post | null>  {
        return this.postRepository.findPostById(postId);
    }

    async findPostForBlogById(blogId: string): Promise<Post | null>  {
        return this.postRepository.findPostForBlogById(blogId);
    }
}