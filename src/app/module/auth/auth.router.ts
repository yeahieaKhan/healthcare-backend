import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
router.post("/registration", AuthController.registerPatient);

export const authRouter = router;
