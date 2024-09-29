import app from './app';
import { ServerConfig } from './config';

// Start the server and handle server-specific errors
const server = app.listen(ServerConfig.PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`APPLICATION_STARTED`, {
        meta: {
            PORT: ServerConfig.PORT,
            SERVER_URL: ServerConfig.SERVER_URL,
        },
    });
});

// Handle server errors
server.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(`SERVER_ERROR`, { meta: error });

    server.close((closeError) => {
        if (closeError) {
            // eslint-disable-next-line no-console
            console.error(`SERVER_CLOSE_ERROR`, { meta: closeError });
        }
        process.exit(1); // Exit the process after closing the server
    });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error(`UNHANDLED_PROMISE_REJECTION`, { meta: reason });

    server.close((closeError) => {
        if (closeError) {
            // eslint-disable-next-line no-console
            console.error(`SERVER_CLOSE_ERROR`, { meta: closeError });
        }
        process.exit(1);
    });
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error(`UNCAUGHT_EXCEPTION`, { meta: error });

    server.close((closeError) => {
        if (closeError) {
            // eslint-disable-next-line no-console
            console.error(`SERVER_CLOSE_ERROR`, { meta: closeError });
        }
        process.exit(1);
    });
});
