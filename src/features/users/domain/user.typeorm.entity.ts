import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm";
import { randomUUID } from 'crypto';
import { add } from "date-fns";

@Entity('Users')
export class User {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ type: 'varchar', length: 255, nullable: false, collation: 'C' })
login: string;

@Column({ type: 'varchar', nullable: false })
password: string;

@Column({ type: 'varchar', nullable: false })
email: string;

@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
createdAt: Date;

@Column({ type: 'varchar', default: '' })
confirmationCode: string;

@Column({ type: 'varchar', default: '' })
expirationDate: string;

@Column({ type: 'boolean', default: false })
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
        // user.expirationDate = add(new Date(), { hours: 1, minutes: 30 }).toISOString();
        user.expirationDate = new Date().toISOString();
        user.isConfirmed = false;
        return user;
    }
}

// @OneToOne(() => User, (user: User) => user.userConfirm)
// @JoinColumn({ name: 'userId' })
// user: User;
// @Column({ unique: true })
// userId: number;