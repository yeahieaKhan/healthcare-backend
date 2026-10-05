export interface TErrorSources {
  path: string;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  message: string;
  errorSources?: TErrorSources[];
  error?: unknown;
  statusCode?: number;
}
