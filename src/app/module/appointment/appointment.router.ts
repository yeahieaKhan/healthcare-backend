import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";
import { AppointmentController } from "./appointment.controller";

const router = express.Router();

router.post(
  "/book-appointment",
  checkAuth(Role.PATIENT),
  AppointmentController.createBookingAppointment,
);
router.get(
  "/my-booking",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  AppointmentController.getMyBookingAppoints,
);

export const AppointmentRouter = router;
