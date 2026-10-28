import { Request, Response } from "express";
import { DoctorScheduleService } from "./doctoterSchedule.service";

const createDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = req.user;
    console.log("User is doctor shedule ", user);
    const result = await DoctorScheduleService.createMyDoctorSchedule(
      user,
      payload,
    );

    return res.status(201).json({
      success: true,
      message: "Doctor Schedule create successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: error.message,
    });
  }
};

export const DoctorScheduleController = {
  createDoctorSchedule,
};
