import dotenv from "dotenv";

dotenv.config();

const envConstants = {
  PORT: process.env.PORT,
  NODE_SERVER_PORT: process.env.NODE_SERVER_PORT,
  NODE_ENV: process.env.NODE_ENV,
  EXPRESS_ROUTER_VERSION: process.env.EXPRESS_ROUTER_VERSION,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  WASABI_REGION: process.env.WASABI_REGION,
  WASABI_ENDPOINT: process.env.WASABI_ENDPOINT,
  WASABI_BUCKET_NAME: process.env.WASABI_BUCKET_NAME,
  WASABI_ACCESS_KEY: process.env.WASABI_ACCESS_KEY,
  WASABI_SECRET_KEY: process.env.WASABI_SECRET_KEY,
  MAILGUN_URI: process.env.MAILGUN_URI,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  EMAIL_SMTP_DOMAIN_MAILGUN: process.env.EMAIL_SMTP_DOMAIN_MAILGUN,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

export default envConstants;
