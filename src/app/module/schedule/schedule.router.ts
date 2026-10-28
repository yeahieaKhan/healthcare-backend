import express from "express";
import { ScheduleController } from "./schedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { createScheduleZodSchema } from "./schedule.validation";

const router = express.Router();

router.post(
  "/",
  ScheduleController.createSchedule,
  validateRequest(createScheduleZodSchema),
);
router.get("/", ScheduleController.getAllSchedules);
router.get("/:id", ScheduleController.getDoctorById);
router.patch("/:id", ScheduleController.updateSchedule);

export const ScheduleRoutes = router;
