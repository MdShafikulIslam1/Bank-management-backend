import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expires_in: process.env.JWT_EXPIRES_IN as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as string,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
  resetLink: process.env.RESET_PASSWORD_UI_LINK,
  email: process.env.EMAIL,
  nodemailer_app_pass: process.env.NODE_MAILER_APP_PASSWORD,
};
