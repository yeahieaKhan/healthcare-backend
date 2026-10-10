import { Request, Response } from "express";
import { UserService } from "./user.service";
import { success } from "zod";

const createDoctor = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await UserService.createDoctor(payload);
    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      error: error,
    });
  }
};

// create admin

const createAdmin = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log(payload);
    const result = await UserService.createAdmin(payload);
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: false,
      error: error,
    });
  }
};

export const UserController = {
  createDoctor,
  createAdmin,
};
