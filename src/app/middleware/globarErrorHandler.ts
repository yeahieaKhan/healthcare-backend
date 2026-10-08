import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler:", err);
  }
  let errorSources: TErrorSources[] = [];
  let statusCode: number = 500;
  let message: string = "Internal Server Error";
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;

    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
    stack = err.stack;
    errorSources;
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources: errorSources,

    error: envVars.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
