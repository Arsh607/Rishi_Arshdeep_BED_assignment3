import { Request, Response, NextFunction} from "express";
import * as eventService from "../services/eventService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const{events , count } = await eventService.getAll();
        return res.status(HTTP_STATUS.OK).json({
            message: "Events retrieved",
            count,
            data: events
        });
    } catch(err) {
        next(err);
    }
};

export const getByID = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const event = await eventService.getEventByID(req.params.id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Event retrieved",
            data: event
        });
    } catch(err) {
        next(err);
    }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const event = await eventService.createEvent(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Event created",
            data: event
        });
    } catch(err) {
        next(err);
    }
};

export const updateEvent = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const event =  await eventService.updateEvent(req.params.id, req.body);
        return res.status(HTTP_STATUS.OK).json({
            message: "Event updated",
            data: event
        });
    } catch (err) {
        next(err);
    }
};

export const deleteEvent = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        await eventService.deleteEvent(req.params.id);
        return res.status(HTTP_STATUS.OK).json({message: "Event deleted"});
    } catch (err) {
        next(err);
    }
};