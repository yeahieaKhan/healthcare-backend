import { Request, Response } from "express";
import { AppointmentBookingService } from "./appointment.service";

const createBookingAppointment = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = req.user;
    const result = await AppointmentBookingService.bookAppointment(
      payload,
      user,
    );
    return res.status(201).json({
      success: true,
      message: "Appointment booking successfully",
      date: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getMyBookingAppoints = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await AppointmentBookingService.getMyBookingAppoints(user);
    return res.status(201).json({
      success: true,
      message: "Appointment booking successfully",
      date: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

export const AppointmentController = {
  createBookingAppointment,
  getMyBookingAppoints,
};
