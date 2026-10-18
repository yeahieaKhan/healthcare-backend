import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import ms, { StringValue } from "ms";
import { envVars } from "../../config/env";
import { json, success } from "zod";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";
import { auth } from "../../lib/auth";

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

// const get me controller

const getMeController = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await AuthService.getMe(user);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

// refresh token controller

const getRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToke = req.cookies["better-auth.session_token"];

    if (!refreshToken) {
      throw new AppError(404, "Refresh token is missing");
    }
    const result = await AuthService.getNewToken(
      refreshToken,
      betterAuthSessionToke,
    );

    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthTokenCookie(res, sessionToken);

    res.status(201).json({
      success: true,
      message: "Refresh token fetched",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: true,
      message: "Something went wrong",
      error: error,
    });
  }
};

// change password

const changePassword = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.changePassword(
      payload,
      betterAuthSessionToken,
    );

    const { accessToken, refreshToken, token } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthTokenCookie(res, token as string);

    res.status(201).json({
      success: true,
      message: "Password change successfully",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const logOutUser = async (req: Request, res: Response) => {
  try {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.logOutUser(betterAuthSessionToken);

    CookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    CookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    CookieUtils.clearCookie(res, "better-auth.session_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      success: true,
      message: "Log out successfully",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);
    res.status(201).json({
      success: true,
      message: "Email Verification successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// forget passowd p assword

const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("user email in congroller ", email);
    const result = await AuthService.forgerPassword(email as string);
    console.log(result);

    res.status(201).json({
      success: true,
      message: "Forget password successfully",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    await AuthService.resetPassword(email, otp, newPassword);
    res.status(201).json({
      success: true,
      message: "Password Reset successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const googleLogin = async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/dashboard";

  const encodedRedirectPath = encodeURIComponent(redirectPath as string);

  const callbackUrl = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackUrl: callbackUrl,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
};

const googleLoginSuccess = async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });

  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);

  const {accessToken, }
};

export const AuthController = {
  registerPatient,
  signIn,
  getMeController,
  getRefreshToken,
  changePassword,
  logOutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLogin,
};
