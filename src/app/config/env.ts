import dotenv from "dotenv";
import AppError from "../errorHelpers/AppError";

dotenv.config();

interface EvnConfig {
  NODE_ENV: string;
  PORT: string | number;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

const loadEnvVariables = (): EvnConfig => {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new AppError(
        500,
        `Missing required environment variable: ${varName}`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
  };
};

export const envVars = loadEnvVariables();
