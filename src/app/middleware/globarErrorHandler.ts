import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler:", err);
  }

  let statusCode: number = 5000;
  let message: string = "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};
