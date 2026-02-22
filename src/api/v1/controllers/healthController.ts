import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as healthService from "../services/healthServices";
import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
    const healthCheckResponse = healthService.healthCheck
    res.status(HTTP_STATUS.OK).json(healthCheckResponse);
};