import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";

export const handleZodError = (error: z.ZodError): TErrorResponse => {
  const statusCode = 400;
  const message = "zod Validation Error";
  const errorSource: TErrorSources[] = [];
  error.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join(" =>"),
      message: issue.message,
    });
  });
  return { success: false, message, errorSources: errorSource, statusCode };
};
