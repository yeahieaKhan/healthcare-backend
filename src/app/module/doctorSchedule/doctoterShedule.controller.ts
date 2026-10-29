import { Request, Response } from "express";
import { DoctorScheduleService } from "./doctoterSchedule.service";
import { IqueryParams } from "../../interfaces/query.interface";

const createDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = req.user;

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
      error: error,
    });
  }
};

const allDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const result = await DoctorScheduleService.getAllDoctorSchedules(
      query as IqueryParams,
    );

    return res.status(201).json({
      success: true,
      message: "Doctor Schedule create successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: error,
    });
  }
};

const getMySchedule = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const query = req.query;

    console.log("user form my my schedule", user.userId);

    const result = await DoctorScheduleService.getMyDoctorSchedules(
      user,
      query as IqueryParams,
    );

    return res.status(200).json({
      success: true,
      message: "My schedule ",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch my schedule",
      error: error,
    });
  }
};

export const DoctorScheduleController = {
  createDoctorSchedule,
  allDoctorSchedule,
  getMySchedule,
};
