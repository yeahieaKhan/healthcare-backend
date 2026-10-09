import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";

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

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
};
