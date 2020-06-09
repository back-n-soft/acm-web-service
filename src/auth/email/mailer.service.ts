import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {UserService} from "../../users/user.service";
import {UserInput} from "../../users/input/user.input";
import {v4} from "uuid";
import * as hbs from "nodemailer-express-handlebars";
import {ENV} from "../../shared/config/env.config";
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {
    constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {
    }

    private static async sendEmail(mailOptions) {
        var smtpConfig = {
            host: ENV.SMTP.HOST,
            port: ENV.SMTP.PORT,
            secure: ENV.SMTP.SSL,
            auth: {
                user: ENV.SMTP.USER,
                pass: ENV.SMTP.PASS
            }
        };
        let transporter = nodemailer.createTransformer(smtpConfig);
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.hbs',
                partialsDir: 'src/auth/email/templates',
                layoutsDir: 'src/auth/email/templates',
                defaultLayout: 'email.hbs',
            },
            viewPath: 'src/auth/email/templates',
            extName: '.hbs',
        }));
        try {
            return transporter.sendMail(mailOptions);
        } catch (e) {
            throw e;
        }
    }
}