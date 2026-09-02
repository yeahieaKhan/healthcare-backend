import { Router } from "express";
import { SpecialtyController } from "./specilty.controller";

const router = Router();

router.post("/add-specialty", SpecialtyController.specialtyCreate);
router.get("/all-specialty", SpecialtyController.getAllSpecialty);
router.get("/all-specialty/:id", SpecialtyController.getSingleSpecialty);

export const SpecialtyRouter = router;
