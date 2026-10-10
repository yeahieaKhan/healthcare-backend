import { prisma } from "../../lib/prisma";

const getAllAdminAndSuperAdmin = async () => {
  const result = await prisma.admin.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const AdminService = {
  getAllAdminAndSuperAdmin,
};
