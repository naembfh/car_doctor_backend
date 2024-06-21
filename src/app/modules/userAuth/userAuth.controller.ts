import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserAuthService } from "./userAuth.service";

// Define signup controller without catchAsync
const signup = catchAsync(async (req, res) => {
  const user = await UserAuthService.signupService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
    data: user,
  });
});

const login = catchAsync(async (req, res) => {
  const userData = await UserAuthService.loginService(req.body);
  const { token, user } = userData;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: userData?.token,
    data: userData?.user,
  });
});

export const userAuthControllers = {
  signup,
  login,
};
