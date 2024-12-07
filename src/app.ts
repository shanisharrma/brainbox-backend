import express from 'express';
import path from 'path';
import apiRoutes from './routes';
import { ErrorMiddleware } from './middlewares';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './config';

const app = express();

// Middlewares
app.use(helmet()); // Protects against common vulnerabilities by setting HTTP headers
app.use(cookieParser());
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        origin: ['http://localhost:5173', 'http://localhost:4173', 'https://brainbox-frontend.netlify.app/'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api', apiRoutes);

// * swagger api documentation
swaggerDocs(app);

// Error Middlewares
app.use(ErrorMiddleware.interceptError); // Intercepting errors at an early stage
app.use(ErrorMiddleware.notFound); //Not Found Error Handler
app.use(ErrorMiddleware.global); //Global Error Handler

export default app;
