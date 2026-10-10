import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdatedAdminPayload } from "./admin.interface";

const getAllAdminAndSuperAdmin = async () => {
  const result = await prisma.admin.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getSingleAdmin = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updatedAdmin = async (id: string, payload: IUpdatedAdminPayload) => {
  const isAdminExits = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isAdminExits) {
    throw new AppError(404, "Admin or super admin not found");
  }

  const { admin } = payload;

  const result = await prisma.admin.update({
    where: { id },
    data: {
      ...admin,
    },
  });

  return result;
};

export const AdminService = {
  getAllAdminAndSuperAdmin,
  getSingleAdmin,
  updatedAdmin,
};
