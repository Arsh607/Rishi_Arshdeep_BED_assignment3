import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';
import { HTTP_STATUS } from './constants/httpsConstants';
import healthRouter from './api/v1/routes/healthRoute';

const app: Express = express();
app.use(morgan('combined'));
app.use('/', healthRouter);

export default app;