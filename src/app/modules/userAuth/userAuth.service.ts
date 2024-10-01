import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TLoginUser, TUserAuth, UserRole } from "./userAuth.interface";
import { UserAuth } from "./userAuth.model";

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

  if (!(await UserAuth.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
  }

  const jwtPayload = {
    userId: user.id,        
    phone: user.phone,
    name: user.name,        
    email: user.email,      
    role: user.role,        
    address: user?.address,  
    img: user?.img,  
  };

  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);

  // Save refresh token in the database
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const createAccessToken = (payload: any) => {
  return jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });
};

const createRefreshToken = (payload: any) => {
  return jwt.sign(payload, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  });
};

const findUserByRefreshToken = async (refreshToken: string) => {
  return await UserAuth.findOne({ refreshToken });
};

const getAllUsersService = async () => {
  const users = await UserAuth.find({});
  return users;
};

const updateUserRoleService = async (userId: string, newRole: UserRole) => {
  const user = await UserAuth.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.role = newRole;
  await user.save();
  return user;
};

const updateUserProfile = async (
  userId: string,
  updatedData: Partial<TUserAuth>
) => {
  const user = await UserAuth.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Update user fields with the provided data
  user.name = updatedData.name || user.name;
  user.phone = updatedData.phone || user.phone;
  user.address = updatedData.address || user.address;
  user.img = updatedData.img || user.img;

  await user.save();

  return user;
};

export const UserAuthService = {
  signupService,
  loginService,
  createAccessToken,
  createRefreshToken,
  findUserByRefreshToken,
  getAllUsersService,
  updateUserRoleService,
  updateUserProfile,
};
