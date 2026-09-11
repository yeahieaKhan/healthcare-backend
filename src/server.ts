import dotenv from "dotenv";
import app from "./app";
import { envVars } from "./config/env";

dotenv.config();

const bootstrap = async (): Promise<void> => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

bootstrap();
