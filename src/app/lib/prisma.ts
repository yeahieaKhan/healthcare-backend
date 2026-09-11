import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";
import { envVars } from "../../config/env";

const connectionString = envVars.DATABASE_URL; // Use the DATABASE_URL from your environment variables

const adapter = new PrismaPg(connectionString);

export const prisma = new PrismaClient({
  adapter,
});
