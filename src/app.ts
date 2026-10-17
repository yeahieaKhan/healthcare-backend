import express from "express";
import cors from "cors";

import { IndexRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globarErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/template`));

app.use("/api/auth", toNodeHandler(auth));

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
