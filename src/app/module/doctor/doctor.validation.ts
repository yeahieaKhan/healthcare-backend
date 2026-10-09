import z from "zod";
import { Gender } from "../../../../generated/prisma/client";

export const updateDoctorZodSchema = z.object({
  doctor: z.object({
    name: z
      .string("Name must be a string")
      .min(5, "Name must be at least 5 characters long")
      .max(50, "Name must be at most 50 characters long"),
    profilePhoto: z.url("Profile photo must be a valid URL").optional,
    contactNumber: z
      .string("Contact number must be a string")
      .min(10, "Contact number must be at least 10 characters long")
      .max(15, "Contact number must be at most 15 characters long"),
    address: z
      .string("Address must be a string")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be at most 100 characters long"),
    registrationNumber: z
      .string("Registration number must be a string")
      .min(5, "Registration number must be at least 5 characters long")
      .max(20, "Registration number must be at most 20 characters long"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "Gender must be either 'MALE', 'FEMALE' or 'OTHER'",
    ),
    appointmentFee: z
      .number("Appointment fee must be a number")
      .min(0, "Appointment fee must be at least 0")
      .max(10000, "Appointment fee must be at most 10000"),
    qualification: z
      .string("Qualification must be a string")
      .min(2, "Qualification must be at least 2 characters long")
      .max(50, "Qualification must be at most 50 characters long"),
    currentWorkingPlace: z
      .string("Current working place must be a string")
      .min(2, "Current working place must be at least 2 characters long")
      .max(50, "Current working place must be at most 50 characters long"),
    designation: z
      .string("Designation must be a string")
      .min(2, "Designation must be at least 2 characters long")
      .max(50, "Designation must be at most 50 characters long"),
  }).optional,
    specialties:z.array(
      z.object({
        specialtyId: z.uuid("Specialty ID must be a UUID"),
      })
    ).optional(),
});
