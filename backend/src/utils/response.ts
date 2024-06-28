import { Response } from "express";
import { z } from "zod";
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
    message: message ? message : null,
    data,
  });
};

export const sendError = ({
  res,
  status,
  data = null,
  message,
}: {
  res: Response;
  status: number;
  data?: any;
  message: string;
}) => {
  res.status(status).json({
    status: "error",
    message,
    data,
  });
};

export const errorHandler = (res: Response, err: any) => {
  if (err instanceof z.ZodError) {
    // Map each error to a string describing the issue
    const errorMessages = err.errors.map((err) => {
      // You can further customize this message format as needed
      return `${err.path.join(".")}: ${err.message}`;
    });

    // Join all error messages into a single string separated by semicolons or any other separator you prefer
    const formattedErrorMessage = errorMessages.join("; ");

    return res.status(400).json({
      status: "error",
      message: formattedErrorMessage,
      data: null,
    });
  }

  if (err.errors && err.errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: err.message,
      data: null,
      path: err.path,
    });
  }

  if (err.message) {
    return res.status(400).json({
      status: "error",
      message: err.message,
      data: null,
      path: err.path,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    data: null,
    path: "",
  });
};
