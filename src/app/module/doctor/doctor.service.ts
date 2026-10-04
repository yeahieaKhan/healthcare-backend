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
    throw new Error("Failed to fetch doctors");
  }
};

export const DoctorService = {
  getAllDoctors,
};
