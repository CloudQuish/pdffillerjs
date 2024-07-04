import { NextFunction, Request, Response } from "express";
import { sendError } from "@utils";

export const auth_token_api = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // autthorization bearer
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
  } catch (error) {}
};
