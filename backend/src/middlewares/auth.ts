import { jwtDecode } from "jwt-decode";
import { NextFunction, Request, Response } from "express";
import { UserEntity } from "@entity";
import { sendError, getToken } from "@utils";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getToken(req);
  if (!token) {
    return sendError({
      res,
      status: 401,
      data: null,
      message: "Login is required to access this!",
    });
  }

  let decoded: any = jwtDecode(token);

  if (!decoded.id) {
    return sendError({
      res,
      status: 401,
      data: null,
      message: "Login is required to access this!",
    });
  }

  let user = await UserEntity.findOne({
    where: { provider_id: decoded.id },
  });

  if (!user) {
    return sendError({
      res,
      status: 401,
      data: null,
      message: "Login is required to access this!",
    });
  }
  req.user = user;
  next();
};




