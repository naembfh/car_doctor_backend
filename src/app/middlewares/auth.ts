import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { UserAuth } from "../modules/userAuth/userAuth.model";
import catchAsync from "../utils/catchAsync";

const USER_ROLE = {
  user: "user",
  admin: "admin",
} as const;

interface JwtPayload {
  userId: string;
  role: "user" | "admin";
  email: string;
}

export type TUserRole = keyof typeof USER_ROLE;

const auth = (requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, email } = decoded;
    // checking if the user is exist
    const user = await UserAuth.IsUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    if (!requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Not permissible !");
    }

    req.user = decoded; // Assuming req.user is a valid place to store user info
    next();
  });
};

export default auth;
