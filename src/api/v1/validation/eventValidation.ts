import Joi from 'joi';

export const createEventSchema = Joi.object({
    name: Joi.string().min(3).required(),
    date: Joi.date().iso().required().greater("now"),
    capacity: Joi.number().integer().required().min(5),
    registrationCount: Joi.number().integer().default(0).max(Joi.ref("capacity")).min(0),
    status: Joi.string().valid("active", "cancelled", "completed").default("active"),
    category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general")
    .default("general")
});