import { TypeUserPagination } from "src/features/users/api/models/input.models";
import { SortDirection } from "../types/user.types";

export const userPagination = (query: TypeUserPagination): any => {
    return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection
        ? (query.sortDirection as unknown as SortDirection)
        : "desc",
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    };
}