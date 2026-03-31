import dotenv from "dotenv";
dotenv.config();
import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';
import { HTTP_STATUS } from './constants/httpConstants';
import healthRouter from './api/v1/routes/healthRoute';
import eventRouter from "./api/v1/routes/eventRoute";
import helmet from 'helmet';
import cors from "cors";
import setupSwagger from "../config/swagger";

const app: Express = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
    hsts:
      process.env.NODE_ENV === "production"
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
  })
);
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/events', eventRouter);
setupSwagger(app);
export default app;