import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';

const app: Express = express();
app.use(morgan('combined'));

export default app;