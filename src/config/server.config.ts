import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

export default {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,

    // Database Configuration
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,

    // Rate Limiter Configuration
    POINTS: Number(process.env.POINTS),
    DURATION: Number(process.env.DURATION),
    BLOCK_DURATION: Number(process.env.BLOCK_DURATION),

    // Password Configuration
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS),

    // Email Service
    EMAIL_SERVICE_API_KEY: process.env.EMAIL_SERVICE_API_KEY,

    // JWT Access and Refresh Secret Key
    ACCESS_TOKEN: {
        SECRET: process.env.ACCESS_TOKEN_SECRET,
        EXPIRY: 60 * 60,
    },

    REFRESH_TOKEN: {
        SECRET: process.env.REFRESH_TOKEN_SECRET,
        EXPIRY: 15 * 24 * 60 * 60,
    },
};
