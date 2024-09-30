import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

export default {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,

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
};
