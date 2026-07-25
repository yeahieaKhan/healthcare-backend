import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const registerPatient = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await AuthService.registerPatient(data);
    res.status(201).send({
      success: true,
      message: "Patient create successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
      data: error,
    });
  }
};

export const AuthController = {
  registerPatient,
};
