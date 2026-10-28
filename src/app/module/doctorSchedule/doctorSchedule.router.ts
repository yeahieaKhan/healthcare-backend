import express from "express";
import { DoctorScheduleController } from "./doctoterShedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.createDoctorSchedule,
);

export const DoctorScheduleRouter = router;
