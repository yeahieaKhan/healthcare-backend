import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import ms, { StringValue } from "ms";
import { envVars } from "../../config/env";

const registerPatient = async (req: Request, res: Response) => {
  try {
    const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
    console.log({ maxAge });

    const data = req.body;
    const result = await AuthService.registerPatient(data);
    console.log("result form user registration ", result);

    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthTokenCookie(res, token as string);
    res.status(201).send({
      success: true,
      message: "Patient create successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
      data: error,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signIn(req.body);
    console.log("result form user login ", result);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthTokenCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};
export const AuthController = {
  registerPatient,
  signIn,
};
