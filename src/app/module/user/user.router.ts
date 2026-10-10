import { Router } from "express";
import { UserController } from "./user.controller";

import validateRequest from "../../middleware/validateRequest";
import { createAdminZodSchema, createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/createDoctor",
  validateRequest(createDoctorZodSchema),
  UserController.createDoctor,
);

router.post(
  "/createAdmin",
  validateRequest(createAdminZodSchema),
  UserController.createAdmin,
);

export const UserRouter = router;
