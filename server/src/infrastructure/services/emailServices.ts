// src/infrastructure/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, SendGrid)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendWelcomeEmail = async (
  to: string,
  name: string,
  password: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Welcome to Our Community!",
    text: `Hi ,\n\nWelcome to our service! We're glad to have you on board.\n\nHere are your login details:\n- Email: ${to}\n- Password: ${password}\n\nBest regards,\nThe Team`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOTPToEmail=async(email: string, otp:string): Promise<void> =>{
  const subject = "Password Reset OTP";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Verification</h2>
      <p>You have requested to reset your password. Please use the following OTP to verify your request:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
        ${otp}
      </div>
      <p>This OTP is valid for 10 minutes. If you did not request this password reset, please ignore this email.</p>
      <p>Thank you,<br>Your App Team</p>
    </div>
  `;
  let info = await transporter.sendMail({
    from: `"Image App" <${ process.env.EMAIL_USER}>`, 
    to: email,
      subject: subject,
      html: htmlContent
  });

}
