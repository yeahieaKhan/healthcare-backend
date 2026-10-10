import { prisma } from "../../lib/prisma";

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

export const AdminService = {
  getAllAdminAndSuperAdmin,
  getSingleAdmin,
};
