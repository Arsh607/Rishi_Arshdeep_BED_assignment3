import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const validateBody = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const {value, error} = schema.validate(body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
      const customMessage = (error.details[0] as any)?.context?.message;
      const message = customMessage || error.details[0].message;

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: `Validation error: ${message}`,
      });
    }

    req.body = value;
    next();
};

export const validateParams =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.params, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      const customMessage = (error.details[0] as any)?.context?.message;
      const message = customMessage || error.details[0].message;

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: `Validation error: ${message}`,
      });
    }

    req.params = value;
    next();
  };
