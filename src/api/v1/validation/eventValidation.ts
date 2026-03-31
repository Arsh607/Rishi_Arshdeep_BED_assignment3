import Joi from 'joi';

export const createEventSchema = Joi.object({
    name: Joi.string().min(5).required().messages({'string.min' : 'Name length should be 5.'}),
    date: Joi.date().iso().required().greater("now"),
    capacity: Joi.number().integer().required().min(5),
    registrationCount: Joi.number().integer().default(0).max(Joi.ref("capacity")).min(0),
    status: Joi.string().valid("active", "cancelled", "completed").default("active"),
    category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general")
    .default("general")
});

export const eventIdParamSchema = Joi.object({
    id: Joi.string().required().pattern(/^evt_\d{6}$/)
});

export const updateEventSchema = Joi.object({
    name: Joi.string().min(3),
    date: Joi.date().iso().greater("now"),
    capacity: Joi.number().integer().min(5),
    registrationCount: Joi.number().integer().min(0).max(Joi.ref("capacity")),
    status: Joi.string().valid("active", "cancelled", "completed"),
    category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general")
}).min(1);