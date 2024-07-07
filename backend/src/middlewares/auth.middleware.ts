import { NextFunction, Request, Response } from "express";
import { errorHandler, sendError } from "@utils";
import { APIKey } from "@entity";

export const auth_token_api = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization?.startsWith("Bearer");
    if (!token) {
      return sendError({
        res,
        status: 401,
        data: null,
        message: "Please authorize with API key",
      });
    }
    const api_key = req.headers.authorization?.split(" ")[1];
    if (!api_key) {
      return sendError({
        res,
        status: 401,
        data: null,
        message: "Please authorize with valid API key",
      });
    }
    // find me API_KEY is valid and active
    const apiKey = await APIKey.findOne({
      where: {
        api_key,
        is_active: true,
      },
    });
    if (!apiKey) {
      return sendError({
        res,
        status: 401,
        data: null,
        message: "Invalid API key | Refresh or get new API key",
      });
    }
    apiKey.total_request += 1;
    const api_endpoint_hitting = req.originalUrl.split("/api/")[1];
    switch (api_endpoint_hitting) {
      case "get-fillable-fields-by-url":
        apiKey.get_fillable_fields_by_url_request += 1;
        break;
      case "get-fillable-fields-by-buffer":
        apiKey.get_fillable_fields_by_buffer_request += 1;
        break;
      case "fill-pdf-by-name":
        apiKey.fill_pdf_by_name_request += 1;
        break;
      case "fill-by-url":
        apiKey.fill_pdf_by_url_request += 1;
        break;
      default:
        break;
    }
    await apiKey.save();
    req.api_key = apiKey;
    next();
  } catch (error) {
    return errorHandler(res, error);
  }
};
