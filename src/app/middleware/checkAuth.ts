import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../../generated/prisma/enums";

import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { envVars } from "../config/env";
import { jwtUtils } from "../utils/jwt";
import { error } from "console";
import { CookieUtils } from "../utils/cookie";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //better auth session token varifications
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(404, "Unathories access");
      }
      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;
          const now = new Date();
          const expiresAt = sessionExists.expiresAt;
          const createdAt = sessionExists.createdAt;
          const sessionLifeTime = expiresAt.getTime() - now.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();

          const percentageRemaining = (timeRemaining / sessionLifeTime) * 100;
          if (percentageRemaining < 20) {
            // Refresh the session token
            res.setHeader("X-Refresh-Token", "true");
            res.setHeader(
              "X-Refresh-Token-Expires-At",
              expiresAt.toISOString(),
            );
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log(
              "Session token is about to expire. Refreshing the token...",
            );
          }
          if (user.status === UserStatus.BLOCKED) {
            throw new AppError(401, "User is blocked");
          }
          if (user.isDeleted) {
            throw new AppError(401, "User is deleted");
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              403,
              "Forbidden access! You don't have permission to access this resource.",
            );
          }
        }
      }

      // jwt token acess token varifications

      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(404, "Unauthoried access");
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(404, " Unauthried access");
      }
      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(404, "Unathoried access");
      }

      next();
    } catch (error) {
      console.error("Error in checkAuth middleware:", error);
      return next(new AppError(401, "Unauthorized access"));
    }
  };
