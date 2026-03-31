import express, {Router} from 'express';
import * as eventController from '../controllers/eventController';
import { validateBody, validateParams } from "../middleware/validateRequest";
import { createEventSchema, updateEventSchema, eventIdParamSchema } from "../validation/eventValidation";

const router: Router = express.Router();

/**
 * @openapi
 * /events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get all events
 *     description: Retrieves all events along with the total count.
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Events retrieved
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 */
router.get("/", eventController.getAllEvents);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get event by ID
 *     description: Retrieves a single event by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *           pattern: '^evt_\\d{6}$'
 *           example: evt_000001
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event retrieved
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", validateParams(eventIdParamSchema), eventController.getByID);
router.post("/", validateBody(createEventSchema), eventController.createEvent);
router.put("/:id", validateParams(eventIdParamSchema), 
        validateBody(updateEventSchema), eventController.updateEvent);
router.delete("/:id", validateParams(eventIdParamSchema), eventController.deleteEvent);

export default router;