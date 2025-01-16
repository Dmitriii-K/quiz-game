import { BadRequestException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { EmailService } from "src/infrastructure/adapters/sendEmail";
// import { UserRepository } from "src/features/users/repository/users-sql-repository";
import { UserRepository } from "src/features/users/repository/users.typeorm.repository";
import { User } from "src/features/users/domain/user.sql.entity";

export class PasswordRecoveryCommand {
    constructor(public mail: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(command: PasswordRecoveryCommand): Promise<boolean> {
        const {mail} = command;
        // Проверяем, существует ли пользователь с таким email
        const user: User | null = await this.userRepository.findUserByEmail(mail);
        if (!user) {
            throw new BadRequestException();
        } // Пользователь не найден
        // Генерируем код восстановления
        const recoveryCode = randomUUID();
        await this.userRepository.updateCode(recoveryCode, user.id);
        await this.emailService.sendPasswordRecoveryMail(mail, recoveryCode);
        return true;
    }
}