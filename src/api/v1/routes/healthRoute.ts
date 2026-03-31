import * as controller from "../controllers/healthController";
import express, { Router } from "express";

const router: Router = express.Router();
/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API health
 *     description: Returns service health information including uptime and version.
 *     responses:
 *       200:
 *         description: Health check successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get("/", controller.healthCheck);

export default router;