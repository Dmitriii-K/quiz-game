import { PostRepository } from "../../repository/post.typeorm.repository";
import { Post } from "../../domain/post.typeorm.entity";
import { CommandHandler } from "@nestjs/cqrs";
import { PostInputModel } from "../../api/models/input.model";
import { BadRequestException } from "@nestjs/common";
import { BlogRepository } from "src/features/bloggers_platform/blogs/repository/blog.typeorm.repository";

export class CreatePostCommand {
    constructor(
        public body: PostInputModel,
        public id: string
        ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase {
    constructor(
        private postRepository: PostRepository,
        private blogRepository: BlogRepository
    ) {}

    async execute(command: CreatePostCommand) {
        const {body, id} = command;

        const findBlogNameForId = await this.blogRepository.findBlogNameForId(id);
        if (!findBlogNameForId) {
            throw new BadRequestException({ errorsMessages: { message: "This blog is incorrect", field: "blog" } });
        }
        const newPost: Post = Post.createPost(body.title, body.shortDescription, body.content, body.blogId);
        return this.postRepository.insertPost(newPost);
    }
}