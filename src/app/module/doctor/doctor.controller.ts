import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import { success } from "zod";
import AppError from "../../errorHelpers/AppError";
import { IqueryParams } from "../../interfaces/query.interface";

const getAllDoctors = async (req: Request, res: Response) => {
  const query = req.query;
  try {
    const result = await DoctorService.getAllDoctors(query as IqueryParams);
    res.status(200).json({
      success: true,
      message: "Doctors retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: error.message,
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
      error: error,
    });
  }
};

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
