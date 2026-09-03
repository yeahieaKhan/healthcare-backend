import { Role, UserStatus } from "../../../../generated/prisma/client";
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
    throw new Error("Failed to create user");
  }

  console.log("user regitration", data);

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

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error();
    ("User is blocked");
  }

  if (data.user.status === UserStatus.DELETED) {
    throw new Error();
    ("User is deleted");
  }

  return data;
};

export const AuthService = {
  registerPatient,
  signIn,
};
