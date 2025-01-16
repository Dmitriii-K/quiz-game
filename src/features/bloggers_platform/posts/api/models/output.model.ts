import { likeStatus, NewestLikesType } from "src/features/bloggers_platform/likes/api/models/input.model";

export class PostViewModel {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: likeStatus,
        newestLikes: NewestLikesType[]
    }
}

export class PaginatorPostViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModel[];
}

export function mapPost(post: any, newestLikes): PostViewModel {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: parseInt(post.likesCount, 10) || 0,
            dislikesCount: parseInt(post.dislikesCount, 10) || 0,
            myStatus: post.userLikeStatus,
            newestLikes: newestLikes.map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login,
            })),
        },
    };
}