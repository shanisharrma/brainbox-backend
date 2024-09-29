import express from 'express';
import path from 'path';
import apiRoutes from './routes';
import { ErrorMiddleware } from './middlewares';
import helmet from 'helmet';

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api', apiRoutes);

// Error Middlewares
app.use(ErrorMiddleware.notFound); //Not Found Error Handler
app.use(ErrorMiddleware.global); //Global Error Handler

export default app;
