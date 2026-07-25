import { Role } from "../../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
  name: string;
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
    throw new Error("Failied to new user");
  }

  //   const patinet = await prisma.$transaction(async (tx) => {
  //     await tx.pa;
  //   });

  return data;
};

export const AuthService = {
  registerPatient,
};
