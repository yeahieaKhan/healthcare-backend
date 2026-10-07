import { Prisma, Specialty } from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
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
    throw new AppError(400, "Specialty already exists");
  }

  return await prisma.specialty.create({
    data: payload,
  });
};

const getAllSpecialty = async () => {
  try {
    const result = await prisma.specialty.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return result;
  } catch (error) {
    console.error("Error fetching specialties:", error);
    throw new AppError(500, "Failed to fetch specialties");
  }
};

const singleSpecialty = async (id: string) => {
  try {
    const result = await prisma.specialty.findUnique({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error("Error fetching specialty:", error);
    throw new AppError(500, "Failed to fetch specialty");
  }
};

const updateSpecialty = async (
  id: string,
  payload: { title?: string; description?: string },
) => {
  try {
    const result = await prisma.specialty.update({
      where: {
        id,
      },
      data: payload,
    });

    return result;
  } catch (error) {
    console.error("Something went wrong!");
    throw new AppError(500, "Something went wrong!");
  }
};

export const SpecialtyService = {
  createSpecialty,
  getAllSpecialty,
  singleSpecialty,
  updateSpecialty,
};
