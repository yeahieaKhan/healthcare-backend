import { JwtPayload } from "jsonwebtoken";
import { Role, UserStatus } from "../../../../generated/prisma/client";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import { IChangePasswordPayload } from "./auth.interface";
import { userAc } from "better-auth/plugins/admin/access";
import { email } from "zod";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface ISignInPayload {
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.PATIENT,
    },
  });

  if (!data.user) {
    throw new AppError(404, "Failed to create user");
  }

  console.log("user registration", data);

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name,
          email,
        },
      });

      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,

      accessToken,
      refreshToken,
      patient,
    };
  } catch (error) {
    console.error("Error creating patient:", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw new AppError(404, "Failed to create patient");
  }
};

// login
const signIn = async (payload: ISignInPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  // const { headers, response } = result;

  if (!data.user) {
    throw new AppError(404, "Login failed");
  }

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (data.user.status === UserStatus.DELETED) {
    throw new AppError(404, "User is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

// get me service

const getMe = (user: IRequestUser) => {
  const isUserExists = prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: true,
      doctor: {
        include: {
          specialties: true,
        },
      },
    },
  });

  if (!isUserExists) {
    throw new AppError(404, "User not found!");
  }
  return isUserExists;
};

// refresh token

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExist = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExist) {
    throw new AppError(404, "Invalid session Token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(404, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.id,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: { token: sessionToken },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};
// change password

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  console.log("session token from change password", session);

  if (!session) {
    throw new AppError(404, "Invalid session token");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  // set new access token

  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    emailVerified: session.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    emailVerified: session.user.emailVerified,
  });

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

// log out user

const logOutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: ` Bearer ${sessionToken}`,
    }),
  });
  return result;
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

const forgerPassword = async (email: string) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  console.log(isUserExists);
  if (!isUserExists) {
    throw new AppError(500, "User not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError(500, "Email not varifed");
  }
  if (!isUserExists.deletedAt || isUserExists.status === UserStatus.DELETED) {
    throw new AppError(500, "User not found");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExists) {
    throw new AppError(500, "User not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError(500, "Email not varifed");
  }
  if (!isUserExists.deletedAt || isUserExists.status === UserStatus.DELETED) {
    throw new AppError(500, "User not found");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id,
    },
  });
};

export const AuthService = {
  registerPatient,
  signIn,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail,
  forgerPassword,
  resetPassword,
};
