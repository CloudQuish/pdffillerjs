import { Response } from "express";
import { ZodError } from "zod";

interface ApiResponse {
  status: "ok" | "error";
  message?: string | null;
  data?: any;
  path?: string;
}

export const sendSuccess = ({
  res,
  status = 200,
  data,
  message = "",
}: {
  res: Response;
  status?: number;
  data?: any;
  message?: string;
}) => {
  res.status(status).json({
    status: "ok",
    message: message || null,
    data,
  });
};

export const sendError = ({
  res,
  status = 500,
  message = "Internal Server Error",
  data = null,
  path = "",
}: {
  res: Response;
  status?: number;
  message: string;
  data?: any;
  path?: string;
}) => {
  res.status(status).json({
    status: "error",
    message,
    data,
    path,
  });
};

export const errorHandler = (res: Response, err: any) => {
  if (err instanceof ZodError) {
    // Handle Zod validation errors
    const errorMessages = err.errors.map(
      (error) => `${error.path.join(".")} : ${error.message}`
    );
    return sendError({ res, status: 400, message: errorMessages.join("; ") });
  }

  if (err.errors && err.errors.length > 0) {
    // Handle other types of structured errors with messages and paths
    return sendError({ res, status: 400, message: err.message });
  }

  // Fallback to generic error handling
  return sendError({
    res,
    status: 500,
    message: err.message || "Internal Server Error",
  });
};
