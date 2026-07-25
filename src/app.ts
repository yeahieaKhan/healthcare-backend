import express, { Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRouter } from "./app/module/specialty/specialty.router";
import { IndexRouter } from "./app/routes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/v1", IndexRouter);

// app.post("/", async (req: Request, res: Response) => {
//   try {
//     const specialities = await prisma.specialty.create({
//       data: {
//         title: "Hello",
//       },
//     });

//     res.status(201).json({
//       success: true,
//       data: specialities,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// });

export default app;
