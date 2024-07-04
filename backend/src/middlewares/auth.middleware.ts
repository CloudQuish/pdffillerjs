import { jwtDecode } from "jwt-decode";
import { NextFunction, Request, Response } from "express";
import { UserEntity } from "@entity";
import { sendError, getToken } from "@utils";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await getToken(req);

    if (!token) {
      return sendError({
        res,
        status: 401,
        data: null,
        message: "Login is required to access this!",
      });
    }

    const decoded: any = jwtDecode(token);

    if (!decoded.id) {
      return sendError({
        res,
        status: 401,
        data: null,
        message: "Invalid token: Missing user ID",
      });
    }

    const user = await UserEntity.findOne({
      where: { provider_id: decoded.id },
    });

    if (!user) {
      return sendError({
        res,
        status: 401,
        data: null,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return sendError({
      res,
      status: 500,
      data: null,
      message: "Internal server error",
    });
  }
};

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
