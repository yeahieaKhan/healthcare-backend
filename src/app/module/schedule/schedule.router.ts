import express from "express";
import { ScheduleController } from "./schedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post("/", ScheduleController.createSchedule);
router.get("/", checkAuth(Role.ADMIN), ScheduleController.getAllSchedules);
router.get("/:id", ScheduleController.getDoctorById);
router.patch("/:id", ScheduleController.updateSchedule);

export const ScheduleRoutes = router;
