import { Router } from "express";
import { SpecialtyController } from "./specilty.controller";

import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middleware/validateRequest";
import { createSpecialtyZodSchema } from "./specialty.validation";

const router = Router();

router.get(
  "/all-specialty",

  // checkAuth(Role.PATIENT),
  SpecialtyController.getAllSpecialty,
);
router.get("/all-specialty/:id", SpecialtyController.getSingleSpecialty);

router.post(
  "/add-specialty",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createSpecialtyZodSchema),
  SpecialtyController.specialtyCreate,
);

export const SpecialtyRouter = router;
