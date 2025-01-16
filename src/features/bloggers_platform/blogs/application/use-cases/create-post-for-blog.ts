import { CommandHandler } from "@nestjs/cqrs";
import { BlogPostInputModel } from "../../api/models/input.model";
import { PostRepository } from "src/features/bloggers_platform/posts/repository/post.typeorm.repository";
import { Post } from "src/features/bloggers_platform/posts/domain/post.typeorm.entity";

export class CreatePostForBlogCommand {
    constructor(
        public blogId: string,
        public body: BlogPostInputModel
        ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(command: CreatePostForBlogCommand) {
        const {blogId, body} = command;
        const newPost: Post = Post.createPost(body.title, body.shortDescription, body.content, blogId);
        return this.postRepository.insertPostForBlog(newPost);
    }
}