import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';
import { HTTP_STATUS } from './constants/httpConstants';
import healthRouter from './api/v1/routes/healthRoute';

const app: Express = express();
app.use(morgan('combined'));
app.use('/api/v1/health', healthRouter);

export default app;