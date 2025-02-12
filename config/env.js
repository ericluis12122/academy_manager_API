import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { 
    PORT, 
    BASE_URL,
    NODE_ENV, 
    DB_URI, 
    JWT_SECRET, 
    JWT_EXPIRES_IN,
    EMAIL_SERVICE,
    EMAIL_ADDRESS,
    EMAIL_PASSWORD
} = process.env;