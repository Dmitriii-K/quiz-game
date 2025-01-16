import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from 'src/settings/configuration';
const nodemailer = require("nodemailer");

@Injectable()
export class EmailService /*implements IEmailService*/ {
    private transporter;
    constructor(private configService: ConfigService<ConfigurationType, true>) {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hometaskincubator@gmail.com",
                pass: this.configService.get<string>('nodemailerSettings.PASSWORD_BY_EMAIL', {infer: true}),
            },
        });
    }

    async sendMail(email: string, confirmationCode: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: 'Dmitry <hometaskincubator@gmail.com>',
                to: email,
                subject: "Hello ✔",
                text: "Hello bro!",
                html: ` <h1>Thanks for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                </p>`,
            });
        } catch (error) {
            console.error('Send email error', error);
        }
    }
    async sendPasswordRecoveryMail(email: string, recoveryCode: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: 'Dmitry <hometaskincubator@gmail.com>',
                to: email,
                subject: "Hello ✔",
                text: "Hello bro!",
                html: `  <h1>Password recovery</h1>
                        <p>To finish password recovery please follow the link below:
                        <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a></p>`,
            });
        } catch (error) {
            console.error('Send email error', error);
        }
    }
}