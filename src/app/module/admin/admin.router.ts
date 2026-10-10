import { Router } from "express";
import { Role } from "../../../../generated/prisma/client";
import { AdminController } from "./admin.controller";

const router = Router();
router.get("/", AdminController.getAllAdminAndSuperAdmin);

export const AdminRouter = router;
