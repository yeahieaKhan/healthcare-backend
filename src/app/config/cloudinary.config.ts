import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});



export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(400, "File buffer and fileName are required for upload");
  }

  try {
    const extension = fileName.split(".").pop()?.toLowerCase();

    const fileNameWithoutExtension = fileName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "");

    const uniqueName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}_${fileNameWithoutExtension}`;

    const folder = extension === "pdf" ? "pdf" : "images";

    return await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: `healthcare/${folder}/${uniqueName}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(500, "Failed to upload file to Cloudinary"),
            );
          }

          if (!result) {
            return reject(
              new AppError(500, "Cloudinary returned no upload result"),
            );
          }

          resolve(result);
        },
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, "Failed to upload file to Cloudinary");
  }
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);

    if (!match) {
      throw new Error("Invalid Cloudinary URL");
    }

    const publicId = match[1];

    const result = await cloudinary.uploader.destroy(publicId as string, {
      resource_type: "image",
    });

    return result;
  } catch (error) {
    console.error("Failed to delete file from Cloudinary:", error);
    throw new AppError(404, "Failed to delete file form cloudinary ");
  }
};

export const cloudinaryUpload = cloudinary;
