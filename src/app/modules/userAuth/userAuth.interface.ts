/* eslint-disable no-unused-vars */
import { Document, Model } from "mongoose";

export type UserRole = "admin" | "user";

export type TUserAuth = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  address: string;
  img?: string;
};

export interface UserAuthDocument extends Document, TUserAuth {
  refreshToken?: string;
}

export interface UserAuthModel extends Model<UserAuthDocument> {
  IsUserExistsByEmail(email: string): Promise<UserAuthDocument | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

// Define TLoginUser type for login credentials
export type TLoginUser = {
  email: string;
  password: string;
};
