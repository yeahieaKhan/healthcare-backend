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
      error: error.message || "Internal Server Error",
    });
  }
};

export const DoctorController = {
  getAllDoctors,
};
