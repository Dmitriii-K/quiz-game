import { UserInputModel } from "src/features/users/api/models/input.models";
import { User } from "src/features/users/domain/user.sql.entity";
import { BcryptService } from "src/infrastructure/adapters/bcrypt";
import { EmailService } from "src/infrastructure/adapters/sendEmail";
import { CommandHandler } from "@nestjs/cqrs";
// import { UserRepository } from "src/features/users/repository/users-sql-repository";
import { UserRepository } from "src/features/users/repository/users.typeorm.repository";

export class RegisterUserCommand {
    constructor(public body: UserInputModel) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private bcryptService: BcryptService,
        private emailService: EmailService
    ) {}

    async execute(command: RegisterUserCommand) {
        const checkUser = await this.userRepository.checkUserByRegistration(command.body.login, command.body.email);
        if (checkUser !== null) return;
        const password = await this.bcryptService.createHashPassword(command.body.password);
        const newUserForRegistration: User = User.createUserForRegistration(command.body.login, password, command.body.email);
        await this.userRepository.createUser(newUserForRegistration); // сохранить юзера в базе данных
        this.emailService.sendMail(newUserForRegistration.email, newUserForRegistration.confirmationCode);
        return newUserForRegistration;
    }
}