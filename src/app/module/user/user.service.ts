import { Role, Specialty } from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreatedAdminPayload, ICreateDoctorPayload } from "./user.interface";

export const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });
    if (!specialty) {
      throw new Error(`Specialty with id ${specialtyId} not found`);
    }
    specialties.push(specialty);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });
  if (userExists) {
    throw new Error(`User with email ${payload.doctor.email} already exists`);
  }

  const registrationNumberExists = await prisma.doctor.findUnique({
    where: {
      registrationNumber: payload.doctor.registrationNumber as string,
    },
  });
  if (registrationNumberExists) {
    throw new Error(
      `Doctor with registration number ${payload.doctor.registrationNumber} already exists`,
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtiesData = specialties.map((specialty) => ({
        doctorId: doctorData.id,
        specialtyId: specialty.id,
      }));
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtiesData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              createdAt: true,
              updatedAt: true,
            },
          },

          specialties: {
            select: {
              specialty: {
                select: { id: true, title: true },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.error("Error creating doctor:", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw new Error("Failed to create doctor");
  }
};

// create admins

const createAdmin = async (payload: ICreatedAdminPayload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (isUserExist) {
    throw new AppError(404, "User with this email already exist");
  }

  const { admin, role, password } = payload;
  // create user in user table
  const userData = await auth.api.signUpEmail({
    body: {
      ...admin,
      password,
      role,
      needPasswordChange: true,
    },
  });

  // admin create in admin table
  try {
    const adminData = await prisma.admin.create({
      data: {
        userId: userData.user.id,
        ...admin,
      },
    });
    return adminData;
  } catch (error) {
    console.log("Something went wrong");
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
  }
};

export const UserService = {
  createDoctor,
  createAdmin,
};
