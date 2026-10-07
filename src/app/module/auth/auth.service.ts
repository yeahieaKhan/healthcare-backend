import { Role, UserStatus } from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
    throw new AppError(404,"Failed to create user");
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

    return {
      ...data,
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

  const result = await auth.api.signInEmail({
    returnHeaders: true,
    body: {
      email,
      password,
    },
  });

  const { headers, response } = result;

  if (!response.user) {
    throw new AppError(404, "Login failed");
  }

  if (response.user.status === UserStatus.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (response.user.status === UserStatus.DELETED) {
    throw new AppError(404, "User is deleted");
  }

  return {
    headers,
    data: response,
  };
};

export const AuthService = {
  registerPatient,
  signIn,
};
