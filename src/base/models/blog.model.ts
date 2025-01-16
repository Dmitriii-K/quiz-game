import { TypePostForBlogHalper } from "../types/blog.types";
import { SortDirection } from "../types/user.types";

export const blogPagination = (query: TypePostForBlogHalper): any => {
    return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
        ? (query.sortDirection as unknown as SortDirection)
        : "desc"
    };
}