import * as controller from "../controllers/healthController";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", controller.healthCheck);

export default router;