import { Prisma, Specialty } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (
  payload: Prisma.SpecialtyCreateInput,
): Promise<Specialty> => {
  const existingSpecialty = await prisma.specialty.findUnique({
    where: {
      title: payload.title,
    },
  });

  if (existingSpecialty) {
    throw new Error("Specialty already exists");
  }

  return await prisma.specialty.create({
    data: payload,
  });
};

export const SpecialtyService = {
  createSpecialty,
};
