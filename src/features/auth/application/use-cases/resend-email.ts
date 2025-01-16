import { BadRequestException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { EmailService } from "src/infrastructure/adapters/sendEmail";
// import { UserRepository } from "src/features/users/repository/users-sql-repository";
import { UserRepository } from "src/features/users/repository/users.typeorm.repository";
import { User } from "src/features/users/domain/user.typeorm.entity";

export class ResendEmailCommand {
    constructor(public mail: string) {}
}

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(command: ResendEmailCommand) {
        const {mail} = command;
        
        const user: User | null = await this.userRepository.findUserByEmail(mail);
        if (!user) {
            throw new BadRequestException({ errorsMessages: { message: "This email is incorrect", field: "email" } });
        }
        if (user.isConfirmed) {
            throw new BadRequestException({ errorsMessages: { message: "This field is verified", field: "email" } });
        }
        const newCode = randomUUID();
        await this.userRepository.updateCode(newCode, user.id),
        this.emailService.sendMail(mail, newCode)
        return true;
    }
}