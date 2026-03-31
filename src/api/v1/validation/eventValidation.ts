import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateEventInput:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *           minLength: 5
 *           example: Tech Meetup 2026
 *           description: Name of the event. Must be at least 5 characters long.
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2026-06-01T18:00:00.000Z
 *           description: Event date in ISO 8601 format. Must be a future date.
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           example: 100
 *           description: Maximum number of attendees allowed.
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *           description: Number of registered attendees. Defaults to 0 and cannot exceed capacity.
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           example: active
 *           description: Current status of the event. Defaults to active.
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           example: meetup
 *           description: Category of the event. Defaults to general.
 */
export const createEventSchema = Joi.object({
  name: Joi.string().min(5).required().messages({
    "string.min": "Name length should be 5.",
  }),
  date: Joi.date().iso().required().greater("now"),
  capacity: Joi.number().integer().required().min(5),
  registrationCount: Joi.number().integer().default(0).max(Joi.ref("capacity")).min(0),
  status: Joi.string().valid("active", "cancelled", "completed").default("active"),
  category: Joi.string()
    .valid("conference", "workshop", "meetup", "seminar", "general")
    .default("general"),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     EventIdParam:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           pattern: '^evt_\\d{6}$'
 *           example: evt_000001
 *           description: Event ID in the format evt_000001.
 */
export const eventIdParamSchema = Joi.object({
  id: Joi.string().required().pattern(/^evt_\d{6}$/),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateEventInput:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: Updated Meetup Name
 *           description: Updated event name. Must be at least 3 characters long.
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2026-06-10T18:00:00.000Z
 *           description: Updated event date in ISO 8601 format. Must be a future date.
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           example: 120
 *           description: Updated maximum number of attendees.
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           example: 25
 *           description: Updated number of registered attendees.
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           example: active
 *           description: Updated event status.
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           example: seminar
 *           description: Updated event category.
 */
export const updateEventSchema = Joi.object({
  name: Joi.string().min(3),
  date: Joi.date().iso().greater("now"),
  capacity: Joi.number().integer().min(5),
  registrationCount: Joi.number().integer().min(0).max(Joi.ref("capacity")),
  status: Joi.string().valid("active", "cancelled", "completed"),
  category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general"),
}).min(1);