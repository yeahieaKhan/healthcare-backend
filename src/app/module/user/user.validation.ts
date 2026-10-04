import z from "zod";
import { Gender } from "../../../../generated/prisma/client";

export const createDoctorZodSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  doctor: z.object({
    // Define the structure for the doctor object here
    name: z
      .string()
      .min(5, "Name is required")
      .max(30, "Name must be less than 30 characters long"),
    email: z.email("Invalid email address"),
    contactNumber: z
      .string()
      .min(11, "Contact number must be at least 11 characters long")
      .max(14, "Contact number must be less than 15 characters long"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters long")
      .max(100, "Address must be less than 100 characters long")
      .optional(),
    registrationNumber: z
      .string()
      .min(5, "Registration number must be at least 5 characters long")
      .max(20, "Registration number must be less than 20 characters long"),

    experience: z
      .int()
      .min(0, "Experience must be a non-negative number")
      .max(50, "Experience must be less than 50 years")
      .optional(),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "Invalid gender",
    ),
    appointmentFee: z
      .number()
      .min(0, "Appointment fee must be a non-negative number"),
    qualification: z
      .string()
      .min(2, "Qualification must be at least 2 characters long")
      .max(50, "Qualification must be less than 50 characters long"),
    currentWorkingPlace: z
      .string()
      .min(2, "Current working place must be at least 2 characters long")
      .max(50, "Current working place must be less than 50 characters long"),
    designation: z
      .string()
      .min(2, "Designation must be at least 2 characters long")
      .max(50, "Designation must be less than 50 characters long"),
  }),
  specialties: z
    .array(z.uuid("specialties   ID must be an array of strings"))
    .min(1, "At least one specialty is required"),
});
