import { RateLimiterMySQL } from 'rate-limiter-flexible';
import { Sequelize } from 'sequelize';
import { ServerConfig } from '.';

export let rateLimiterMySQL: RateLimiterMySQL | null = null;

export const initRateLimiter = (sequelizeConnection: Sequelize) => {
    rateLimiterMySQL = new RateLimiterMySQL({
        storeClient: sequelizeConnection,
        dbName: ServerConfig.DB_NAME,
        tableName: 'rate_limiter',
        keyPrefix: 'rate_limit_',
        points: ServerConfig.POINTS,
        duration: ServerConfig.DURATION,
        blockDuration: ServerConfig.BLOCK_DURATION,
    });
};
