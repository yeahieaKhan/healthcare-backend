import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdminAndSuperAdmin = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllAdminAndSuperAdmin();
    res.status(200).json({
      success: true,
      message: "Admin fetch successfully",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Admin fetch successfully",
      error: error,
    });
  }
};

const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getSingleAdmin(id as string);
    res.status(200).json({
      success: true,
      message: "Admin fetch successfully",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Admin fetch successfully",
      error: error,
    });
  }
};

const updatedAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    const result = await AdminService.updatedAdmin(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Admin updated failed",
      error: error,
    });
  }
};

export const AdminController = {
  getAllAdminAndSuperAdmin,
  getSingleAdmin,
  updatedAdmin,
};
