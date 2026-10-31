import express from "express";
import { DoctorScheduleController } from "./doctoterShedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/create-my-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.createDoctorSchedule,
);

router.get(
  "/all-doctor-schedule",

  DoctorScheduleController.allDoctorSchedule,
);

router.get(
  "/my-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.getMySchedule,
);

router.get(
  "/:doctorId/schedule/:scheduleId",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.getMySchedule,
);

router.patch(
  "/update-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.updateMyDoctorSchedule,
);
export const DoctorScheduleRouter = router;
