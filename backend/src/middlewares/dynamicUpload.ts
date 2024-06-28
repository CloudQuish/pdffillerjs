import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { file_type_allowed } from "@config";
import { sendError } from "@utils";

const dynamicUpload = ({
  field = "files",
  type = "any",
}: {
  field?: string;
  type?: "single" | "array" | "any";
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!file_type_allowed.includes(field)) {
      return sendError({
        res,
        message: "Invalid field name for file from the client.",
        status: 400,
      });
    }

    let upload;

    const multerConfig = {
      storage: multer.diskStorage({}),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) => {
        const ext = file.mimetype.split("/")[1];
        if (!["pdf"].includes(ext)) {
          return cb(new Error("Only pdf files are allowed."));
        }
        cb(null, true);
      },
      limits: {
        fileSize: parseFloat(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
      },
    };
    switch (type) {
      case "single":
        upload = multer(multerConfig).single(field);
        break;
      case "array":
        upload = multer(multerConfig).array(field, 5);
        break;
      default:
        upload = multer(multerConfig).any();
        break;
    }

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return sendError({
          res,
          message:
            err.code === "LIMIT_UNEXPECTED_FILE"
              ? `Filed name ${field} expected`
              : err.message,
          status: 400,
        });
      } else if (err) {
        return sendError({
          res,
          message: err.message,
          status: 500,
        });
      }

      // Check if files are uploaded
      if (
        (type === "single" &&
          (!req.file || Object.keys(req.file).length === 0)) ||
        (type !== "single" &&
          (!req.files || Object.keys(req.files).length === 0))
      ) {
        return sendError({
          res,
          message: "No files were uploaded.",
          status: 400,
        });
      }

      next();
    });
  };
};

export default dynamicUpload;
