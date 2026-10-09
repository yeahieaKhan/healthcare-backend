import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/client";

const router = Router();
router.get("/", DoctorController.getAllDoctors);
router.get("/:id", checkAuth(Role.PATIENT), DoctorController.getDoctorById);
router.patch("/:id", DoctorController.updateDoctor);

export const DoctorRouter = router;
