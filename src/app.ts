import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';
import { HTTP_STATUS } from './constants/httpConstants';
import healthRouter from './api/v1/routes/healthRoute';
import eventRouter from "./api/v1/routes/eventRoute";

const app: Express = express();
app.use(morgan('combined'));
app.use(express.json());
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/events', eventRouter);

export default app;