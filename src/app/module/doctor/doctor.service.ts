import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new AppError(500, "Failed to fetch doctors");
  }
};


const getDoctorById = async (id: string) => { 
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        }
      }
 
    },
  });

  return doctor;
};


export const DoctorService = {
  getAllDoctors,
  getDoctorById,
};
