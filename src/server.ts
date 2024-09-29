import app from './app';
import { ServerConfig } from './config';
import connection from './database/sequelize';
import { Logger } from './utils/common';
import { Enums } from './utils/constants';

// Start the server and handle server-specific errors
const server = app.listen(ServerConfig.PORT, () => {
    if (connection)
        Logger.info(Enums.EApplicationEvent.DATABASE_CONNECTED, {
            meta: { Host: ServerConfig.DB_HOST, PORT: ServerConfig.DB_PORT },
        });
    Logger.info(Enums.EApplicationEvent.APPLICATION_STARTED, {
        meta: {
            PORT: ServerConfig.PORT,
            SERVER_URL: ServerConfig.SERVER_URL,
        },
    });
});

// Handle server errors
server.on('error', (error) => {
    Logger.error(Enums.EApplicationEvent.APPLICATION_ERROR, { meta: error });

    server.close((closeError) => {
        if (closeError) {
            Logger.error(Enums.EApplicationEvent.SERVER_CLOSE_ERROR, {
                meta: closeError,
            });
        }
        process.exit(1); // Exit the process after closing the server
    });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    Logger.error(Enums.EApplicationEvent.UNHANDLED_PROMISE_REJECTION, {
        meta: reason,
    });

    server.close((closeError) => {
        if (closeError) {
            Logger.error(Enums.EApplicationEvent.SERVER_CLOSE_ERROR, {
                meta: closeError,
            });
        }
        process.exit(1);
    });
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    Logger.error(Enums.EApplicationEvent.UNCAUGHT_EXCEPTION, { meta: error });

    server.close((closeError) => {
        if (closeError) {
            Logger.error(Enums.EApplicationEvent.SERVER_CLOSE_ERROR, {
                meta: closeError,
            });
        }
        process.exit(1);
    });
});
