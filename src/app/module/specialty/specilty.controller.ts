import { Request, Response } from "express";
import { SpecialtyService } from "./specilty.service";
import { string, success } from "better-auth";
import { prisma } from "../../lib/prisma";

const specialtyCreate = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await SpecialtyService.createSpecialty(payload);
  res.status(201).json({
    success: true,
    message: "Specialty create successfully",
    data: result,
  });
};

const getAllSpecialty = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.getAllSpecialty();

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Specialty found!",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Specialties fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching specialties:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch specialties",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getSingleSpecialty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await SpecialtyService.singleSpecialty(id as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Specialty not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Single Specialty fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching specialty:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch specialty",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const SpecialtyController = {
  specialtyCreate,
  getAllSpecialty,
  getSingleSpecialty,
};
