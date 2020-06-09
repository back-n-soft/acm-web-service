import {User} from "../../users/entity/user.entity";
import {ENV} from "../config/env.config";
import * as nodemailer from 'nodemailer'
import {Logger} from "@nestjs/common";
import * as handlebars from 'handlebars'
import * as fs from 'fs'


type EmailType = 'verifyEmail' | 'forgotPassword'


export const sendEmail = async (type: EmailType, user: User, req: any, token: string): Promise<any> => {
    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        host: ENV.SMTP.HOST,
        port: ENV.SMTP.PORT,
        auth: {
            user: ENV.SMTP.USER,
            pass: ENV.SMTP.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const readHTMLFile = (path, callback) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
            if (err) {
                callback(err)
            } else {
                callback(null, html)
            }
        })
    }

    readHTMLFile('./src/auth/email/templates/confirmRegistration.html', (err, html) => {
        const template = handlebars.compile(html)
        const replacements = {
            verifyEmail: {
                link: `${req.headers.origin}/verify/${token}`,
                subject: 'Verification email',
                text1: 'To complete your sign up, please verify your email: ',
                button: 'VERIFY EMAIL',
                name: `${user.firstName} ${user.lastName}`,
                text2: 'Or copy this link and paste it in your web	browser',
            }
        }
        Logger.debug(user);
        const htmlToSend = template(replacements[type]);

        let mailOptions = {
            from: ENV.EMAIL_SERVER,
            to: user.email,
            subject: replacements[type].subject,
            text: `Welcome to ACM APP`,
            html: htmlToSend,
            attachments: [
                {
                    path: './src/auth/email/templates/nan.png',
                    cid: 'nanLogo'
                }
            ]
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(JSON.parse(info));
                Logger.debug(info.response.message, 'Nodemailer');
            }
        })
        transporter.close();

    });

}