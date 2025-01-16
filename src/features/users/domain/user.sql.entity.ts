import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm";
import { randomUUID } from 'crypto';
import { add } from "date-fns";

@Entity('Users')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: "varchar", nullable: false })
    login: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @Column({ type: "varchar", nullable: false })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: "varchar", nullable: false, default: '' })
    confirmationCode: string;

    @Column({ type: "varchar", nullable: false, default: '' })
    expirationDate: string;

    @Column({ type: "boolean", nullable: false, default: false })
    isConfirmed: boolean;

    static createUser(login: string, password: string, email: string): User {
        const user = new User();
        
        user.id = randomUUID();
        user.login = login;
        user.password = password;
        user.email = email;
        user.createdAt = new Date();
        user.confirmationCode = '';
        user.expirationDate = '';
        user.isConfirmed = false;
        return user;
    }

    static createUserForRegistration(login: string, password: string, email: string): User {
        const user = new User();
        
        user.id = randomUUID();
        user.login = login;
        user.password = password;
        user.email = email;
        user.createdAt = new Date();
        user.confirmationCode = randomUUID();
        user.expirationDate = add(new Date(), { hours: 1, minutes: 30 }).toISOString();
        user.isConfirmed = false;
        return user;
    }
}

// @OneToOne(() => User, (user: User) => user.userConfirm)
// @JoinColumn({ name: 'userId' })
// user: User;
// @Column({ unique: true })
// userId: number;