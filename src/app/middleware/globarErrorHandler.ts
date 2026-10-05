import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";

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
  let errorSource: TErrorSources[] = [];
  let statusCode: number = 500;
  let message: string = "Internal Server Error";

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;

    message = simplifiedError.message;
    err.issues.forEach((issue) => {
      errorSource.push(...simplifiedError.errorSources!);
    });
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources: errorSource,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
