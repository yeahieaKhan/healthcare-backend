import { Router } from "express";
import { SpecialtyController } from "./specilty.controller";

const router = Router();

router.post("/", SpecialtyController.specialtyCreate);

export const SpecialtyRouter = router;
