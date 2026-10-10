import { Router } from "express";
import { Role } from "../../../../generated/prisma/client";
import { AdminController } from "./admin.controller";

const router = Router();
router.get("/", AdminController.getAllAdminAndSuperAdmin);
router.get("/:id", AdminController.getSingleAdmin);
router.patch("/:id", AdminController.updatedAdmin);

export const AdminRouter = router;
