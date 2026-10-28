import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import { IqueryParams } from "../../interfaces/query.interface";

const createSchedule = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const schedule = await ScheduleService.createSchedule(payload);

    console.log("shdule created ", schedule);

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const result = await ScheduleService.getAllSchedules(
      req.query as IqueryParams,
    );

    return res.status(200).json({
      success: true,
      message: "Schedules retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve schedules",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ScheduleService.getScheduleById(id as string);
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

const updateSchedule = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const schedule = await ScheduleService.updateSchedule(
      id as string,
      payload,
    );

    console.log("shdule created ", schedule);

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const ScheduleController = {
  createSchedule,
  getDoctorById,
  getAllSchedules,
  updateSchedule,
};
