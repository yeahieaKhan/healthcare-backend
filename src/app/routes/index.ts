import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.router";
import { authRouter } from "../module/auth/auth.router";

const router = Router();

router.use("/auth", authRouter);

router.use("/specialty", SpecialtyRouter);

export const IndexRouter = router;
