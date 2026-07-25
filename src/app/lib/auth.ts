import { betterAuth, boolean, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../../generated/prisma/enums";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  // trustedOrigins: [process.env.APP_URL! || "http://localhost:5000"],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "boolean",
        required: true,
        defaultValue: null,
      },
    },
  },
});
