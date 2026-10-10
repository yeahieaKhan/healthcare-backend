import { Router } from "express";
import { Role } from "../../../../generated/prisma/client";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();
router.get("/", AdminController.getAllAdminAndSuperAdmin);
router.get("/:id", AdminController.getSingleAdmin);
router.patch("/:id", AdminController.updatedAdmin);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.deleteAdmin,
);

export const AdminRouter = router;
