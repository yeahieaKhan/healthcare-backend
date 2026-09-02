import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT;

const bootstrap = async (): Promise<void> => {
  try {
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

bootstrap();
