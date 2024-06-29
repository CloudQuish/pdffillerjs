import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const getToken = (req: Request) => {
  if (req.cookies[process.env.COOKIE_NAME]) {
    return req.cookies[process.env.COOKIE_NAME];
  }

  return null;
};

export const setCookie = (res: Response, token: string) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "strict" as "strict",
    path: "/",
  };

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(process.env.COOKIE_NAME, token, options)
  );
};

export const removeCookie = (res: Response) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "strict" as "strict",
    path: "/",
  };

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(process.env.COOKIE_NAME, "", options)
  );
};
