import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TLoginUser, TUserAuth } from "./userAuth.interface";

import { UserAuth } from "./userAuth.model";
import { createToken } from "./userAuth.utils";

const signupService = async (payload: TUserAuth) => {
  const newUser = await UserAuth.create(payload);
  return newUser;
};

const loginService = async (payload: TLoginUser) => {
  const user = await UserAuth.IsUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This user is not found or email is invalid!"
    );
  }

  if (!(await UserAuth.isPasswordMatched(payload.password, user.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
  const jwtPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };
  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return {
    user,
    token,
  };
};

export const UserAuthService = {
  signupService,
  loginService,
};
