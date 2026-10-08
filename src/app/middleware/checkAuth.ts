import { NextFunction, Request, Response } from "express";
import { Role } from "../../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";

const checkAuth =
  (...authRoles: Role) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(404, "Unathories access");
      }
    } catch (error) {}
  };
