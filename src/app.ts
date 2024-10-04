import express from 'express';
import path from 'path';
import apiRoutes from './routes';
import { ErrorMiddleware } from './middlewares';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(helmet()); // Protects against common vulnerabilities by setting HTTP headers
app.use(cookieParser());
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        origin: ['http://client.com'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api', apiRoutes);

// Error Middlewares
app.use(ErrorMiddleware.notFound); //Not Found Error Handler
app.use(ErrorMiddleware.global); //Global Error Handler

export default app;
