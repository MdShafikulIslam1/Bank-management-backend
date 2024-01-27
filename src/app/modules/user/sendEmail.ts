import nodemailer from 'nodemailer';
import config from '../../../config';
export async function SendEmail(to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email,
      pass: config.nodemailer_app_pass,
    },
  });
  await transporter.sendMail({
    from: config.email, // sender address
    to, // list of receivers
    subject: 'Reset Password Link ✔', // plain text body
    html, // html body
  });
}
