// import { UserInputModel, TypeUserPagination } from "./input.models";
// import { UserViewModel, PaginatorUserViewModel } from "./output.models";
// import { UserDocument } from "../../domain/user.entity";

// export interface IUserService {
//     createUser(user: UserInputModel): Promise<string | false>;
//     deleteUser(id: string): Promise<boolean>;
// }

// export interface IUserQueryRepository {
//     getUserById(id: string): Promise<UserViewModel | null>;
//     getAllUsers(query: TypeUserPagination): Promise<PaginatorUserViewModel>;
// }

// export interface IUserRepository {
//     findUserByLogiOrEmail(data: { login: string, email: string }): Promise<UserDocument | null>;
//     insertUser(user: UserDocument): Promise<string>;
//     deleteUser(id: string): Promise<boolean>;
// }

// export interface IBcryptService {
//     createHashPassword(password: string): Promise<string>;
// }