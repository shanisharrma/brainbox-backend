import { Sequelize } from 'sequelize';
import { ServerConfig } from '../config';
const connection: Sequelize = new Sequelize(
    ServerConfig.DB_NAME ?? '',
    ServerConfig.DB_USER ?? '',
    ServerConfig.DB_PASS ?? '',
    {
        host: ServerConfig.DB_HOST ?? '',
        dialect: 'mysql',
    },
);
export default connection;
