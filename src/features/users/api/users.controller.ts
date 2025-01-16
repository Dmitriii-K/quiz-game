import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query, UseGuards } from "@nestjs/common";
import { TypeUserPagination, UserInputModel } from "./models/input.models";
import { PaginatorUserViewModel, UserViewModel } from "./models/output.models";
import { UserService } from "../application/user.service";
// import { UserQueryRepository } from "../repository/users-sql-query-repository";
import { UserQueryRepository } from "../repository/users.typeorm.query-repository";
import { BasicAuthGuard } from "src/infrastructure/guards/basic.guard";
// import { BasicGuard } from "src/infrastructure/guards/dubl-guards/basic-auth.guard";
import { CreateUserCommand} from "../application/use-cases/create-user";
import { CommandBus } from "@nestjs/cqrs";
// import { UserRepository } from "../repository/users-sql-repository";
import { UserRepository } from "../repository/users.typeorm.repository";
import { ApiBasicAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@ApiBasicAuth()
@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UserController {
    constructor(
        protected userService: UserService,
        protected userQueryRepository: UserQueryRepository,
        protected userRepository: UserRepository,
        private commandBus: CommandBus) {}

    @Get()
    @ApiQuery({ name: 'Description', description: 'Paginations', type: TypeUserPagination })
    @ApiResponse({ status: 200, description: 'Success', type: PaginatorUserViewModel })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getUsers(@Query() query: TypeUserPagination) {
        const users: PaginatorUserViewModel = await this.userQueryRepository.getAllUsers(query);
        return users;
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Возвращает вновь созданного пользователя', type: UserViewModel })
    @ApiResponse({ status: 400, description: 'If the inputModel has incorrect values.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createUser(@Body() body: UserInputModel) {
        // const createResult = await this.userService.createUser(body);
        // const createResult = await this.createUserUseCase.execute(body);
        const createResult = await this.commandBus.execute(new CreateUserCommand(body));
        if (!createResult) {
            throw new BadRequestException({ errorsMessages: [{ message: 'email and login should be unique', field: 'email and login' }] })
        }
        const newUserDB: UserViewModel | null = await this.userQueryRepository.getUserById(createResult);
        return newUserDB;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiParam({ name: 'id', description: 'User id', required: true, type: String })
    @ApiResponse({ status: 204, description: 'No Content'})
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    async deleteUser(@Param('id') id: string) {
        const user = await this.userRepository.findUserById(id)
        if(!user) {
            throw new NotFoundException();
        }
        const deleteResult = await this.userService.deleteUser(id);
        return
    }
}