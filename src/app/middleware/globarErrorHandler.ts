import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import z from "zod";
import status from "http-status";

export interface TErrorSources {
  path: string;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  message: string;
  errorSources?: TErrorSources[];
  error?: unknown;
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): TErrorResponse => {
  console.error(err);

  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler:", err);
  }
  let errorSource: TErrorResponse = [];
  let statusCode: number = 500;
  let message: string = "Internal Server Error";

  if (err instanceof z.ZodError) {
    statusCode = 400;
    message = "zod Validation Error";
    err.issues.forEach((issue) => {
      errorSource.push({
        path: issue.path.join(" =>"),
        message: issue.message,
      });
    });
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
