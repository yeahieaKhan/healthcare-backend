import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLocaleLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "");

    const uniqueName =
      Math.random().toString(32).substring(2) +
      "_" +
      Date.now() +
      "_" +
      fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdf" : "images";

    return {
      folder: `healthcare/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
    };
  },
});

export const multerUpload = multer({ storage });
