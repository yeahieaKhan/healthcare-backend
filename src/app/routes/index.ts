import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.router";
import { authRouter } from "../module/auth/auth.router";
import { UserRouter } from "../module/user/user.router";
import { DoctorRouter } from "../module/doctor/doctor.router";

const router = Router();

router.use("/auth", authRouter);

router.use("/specialty", SpecialtyRouter);

//user router
router.use("/users", UserRouter);
// Doctor router
router.use("/doctors", DoctorRouter);

export const IndexRouter = router;
