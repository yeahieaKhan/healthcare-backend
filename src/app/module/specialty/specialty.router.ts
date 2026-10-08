import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specilty.controller";
import { cookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";

const router = Router();

router.get(
  "/all-specialty",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(404, "Unauthoried access");
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken) {
        throw new AppError(404, " Unauthried access");
      }
      if (verifiedToken.data!.role !== "ADMIN") {
        throw new AppError(404, "Unathoried access");
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  SpecialtyController.getAllSpecialty,
);
router.get("/all-specialty/:id", SpecialtyController.getSingleSpecialty);

router.post("/add-specialty", SpecialtyController.specialtyCreate);

export const SpecialtyRouter = router;
