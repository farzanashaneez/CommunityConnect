// src/infrastructure/emailService.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, name: string,password:string): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Our Service!',
        text: `Hi ${name},\n\nWelcome to our service! We're glad to have you on board.\n\nBest,\nThe Team`,
    };

    await transporter.sendMail(mailOptions);
};