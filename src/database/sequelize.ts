import { Sequelize } from 'sequelize';
import { ServerConfig } from '../config';
const connection: Sequelize = new Sequelize(
    ServerConfig.DB_NAME ?? '',
    ServerConfig.DB_USER ?? '',
    ServerConfig.DB_PASS ?? '',
    {
        host: ServerConfig.DB_HOST ?? '',
        port: Number(ServerConfig.DB_PORT) || 3306,
        dialect: 'mysql',
        dialectOptions: {
            ssl: true, // Some hosting services require SSL; Render may require this based on your database settings.
        },
    },
);
export default connection;
