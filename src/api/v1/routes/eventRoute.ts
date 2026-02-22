import express, {Router} from 'express';
import * as eventController from '../controllers/eventController';
import { validateBody, validateParams } from "../middleware/validateRequest";
import { createEventSchema, updateEventSchema, eventIdParamSchema } from "../validation/eventValidation";

const router: Router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", validateParams(eventIdParamSchema), eventController.getByID);
router.post("/", validateBody(createEventSchema), eventController.createEvent);
router.put("/:id", validateParams(eventIdParamSchema), 
        validateBody(updateEventSchema), eventController.updateEvent);
router.delete("/:id", validateParams(eventIdParamSchema), eventController.deleteEvent);

export default router;