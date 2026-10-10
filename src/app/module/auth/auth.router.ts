import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/registration", AuthController.registerPatient);
router.post("/signIn", AuthController.signIn);

router.get(
  "/getMe",
  checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
  AuthController.getMeController,
);

export const authRouter = router;
