import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import z from "zod";
import status from "http-status";

interface TErrorSources {
  path: string;
  message: string;
}

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
  const errorSource: TErrorSources[] = [];
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

  res.status(statusCode).json({
    success: false,
    message: message,

    errorSources: errorSource,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  });
};
