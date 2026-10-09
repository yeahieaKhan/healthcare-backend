import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specilty.controller";
import { CookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.get(
  "/all-specialty",

  checkAuth(Role.PATIENT),
  SpecialtyController.getAllSpecialty,
);
router.get("/all-specialty/:id", SpecialtyController.getSingleSpecialty);

router.post("/add-specialty", SpecialtyController.specialtyCreate);

export const SpecialtyRouter = router;
