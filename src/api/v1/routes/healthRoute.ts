import * as controller from "../controllers/healthController";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/api/v1/health", controller.healthCheck);

export default router;