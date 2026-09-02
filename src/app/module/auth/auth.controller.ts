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

const signIn = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const result = await AuthService.signIn(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const AuthController = {
  registerPatient,
  signIn,
};
