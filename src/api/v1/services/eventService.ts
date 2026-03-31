import { eventRepository } from "../repository/eventRepository";
import { AppError } from "../middleware/AppError";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Event } from "../models/eventModel";

export const getAll = async(): Promise<{events: Event[], count: number}> => {
    return eventRepository.getAllWithCount();
};

export const getEventByID = async(id: string): Promise<Event> => {
    const event = await eventRepository.getById(id);

    if(!event) {
        throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);
    }

    return event;
};

export const createEvent = async(data: Omit<Event, "id" | "createdAt" | "updatedAt">):
    Promise<Event> => {
        const now = new Date().toISOString();
        const eventToCreate: Omit<Event, "id"> = {
            ...data,
            createdAt: now,
            updatedAt: now,
        };

    return eventRepository.create(eventToCreate);
};

export const updateEvent = async( id: string, changes:
    Partial<Omit<Event, "id" | "createdAt">>): Promise<Event> => {
        const updated = await eventRepository.update(id, {
        ...changes,
        updatedAt: new Date().toISOString(),
    });

  if (!updated) {
    throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};

export const deleteEvent = async(id: string): Promise<void> => {
    const deleted = await eventRepository.delete(id);

    if (!deleted) {
        throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);
    }
};