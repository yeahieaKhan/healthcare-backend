import express from "express";
import cors from "cors";

import { IndexRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globarErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRouter);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
