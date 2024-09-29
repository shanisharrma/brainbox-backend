import express from 'express';
import path from 'path';
import apiRoutes from './routes';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api', apiRoutes);

export default app;
