import AppError from "../../errorHelpers/AppError";
import { IqueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilders";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async (query: IqueryParams) => {
  // try {
  //   const doctors = await prisma.doctor.findMany({
  //     where: {
  //       isDeleted: false,
  //     },
  //     include: {
  //       user: true,
  //       specialties: {
  //         include: {
  //           specialty: true,
  //         },
  //       },
  //     },
  //   });
  //   return doctors;
  // } catch (error) {
  //   console.error("Error fetching doctors:", error);
  //   throw new AppError(500, "Failed to fetch doctors");

  // }

  const queryBuilder = new QueryBuilder(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ isDeleted: false })
    .include({
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    })
    // .dynamicInclude(doctorIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  console.log(result);

  return result;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExists = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!isDoctorExists) {
    throw new AppError(404, "Doctor not found");
  }

  // Implementation for updating doctor details would go here

  const { doctor: doctorData, specialties } = payload;
  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }
    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, isDeleted } = specialty;

        if (isDeleted) {
          await tx.doctorSpecialty.deleteMany({
            where: {
              doctorId: id,
              specialtyId,
            },
          });
        } else {
          // Check whether the specialty exists and is not deleted
          const existingSpecialty = await tx.specialty.findFirst({
            where: {
              id: specialtyId,
              isDeleted: false,
            },
          });

          if (!existingSpecialty) {
            throw new AppError(404, `Specialty not found: ${specialtyId}`);
          }

          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(id);
  return doctor;
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
