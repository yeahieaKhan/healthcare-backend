import { Router } from "express";
import { UserController } from "./user.controller";

import validateRequest from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/createDoctor",
  validateRequest(createDoctorZodSchema),
  UserController.createDoctor,
);

export const UserRouter = router;
