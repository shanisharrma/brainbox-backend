import express from 'express';
import path from 'path';
import apiRoutes from './routes';
import { ErrorMiddleware } from './middlewares';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api', apiRoutes);

// Error Middlewares
app.use(ErrorMiddleware.global); //Global Error Handler

export default app;
