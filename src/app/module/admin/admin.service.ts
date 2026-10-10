import { UserStatus } from "../../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser";
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

// doctor deleted

const deleteAdmin = async (id: string, user: IRequestUser) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(404, "Admin or Super admin not found!");
  }
  if (isAdminExist.id === user.userId) {
    throw new AppError(404, "You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    const updateUser = await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    console.log("user updated", updateUser);

    await tx.session.deleteMany({
      where: {
        userId: isAdminExist.userId,
      },
    });
    await tx.account.deleteMany({
      where: {
        userId: isAdminExist.userId,
      },
    });

    const admin = await getSingleAdmin(id);
    return admin;
  });
  return result;
};

export const AdminService = {
  getAllAdminAndSuperAdmin,
  getSingleAdmin,
  updatedAdmin,
  deleteAdmin,
};
