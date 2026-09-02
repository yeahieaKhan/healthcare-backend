import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
router.post("/registration", AuthController.registerPatient);
router.post("/signIn", AuthController.signIn);

export const authRouter = router;
