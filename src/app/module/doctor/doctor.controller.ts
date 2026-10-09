import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import { success } from "zod";
import AppError from "../../errorHelpers/AppError";

const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const result = await DoctorService.getAllDoctors();
    res.status(200).json({
      success: true,
      message: "Doctors retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: "Failed to retrieve doctors",
    });
  }
};

const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await DoctorService.getDoctorById(id as string);
    res.status(200).json({
      success: true,
      message: "Doctor retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor",
      error: "Internal Server Error",
    });
  }
};

const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await DoctorService.updateDoctor(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: true,
      error: error.message,
    });
  }
};

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
