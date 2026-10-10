import { phoneNumber } from "better-auth/plugins";
import z from "zod";

export const updatedAdminZodSchema = z.object({
  admin: z.object({
    name: z.string("Name is required").optional,
    profilePhoto: z.url("Profile must be valid valid url").optional,
    phoneNumber: z.string("Phone Number is must be required").optional,
  }),
});
