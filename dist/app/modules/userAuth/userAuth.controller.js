"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const userAuth_service_1 = require("./userAuth.service");
const signup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userAuth_service_1.UserAuthService.signupService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User registered successfully",
        data: user,
    });
}));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield userAuth_service_1.UserAuthService.loginService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logged in successfully",
        data: userData,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token is required");
    }
    const user = yield userAuth_service_1.UserAuthService.findUserByRefreshToken(refreshToken);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token");
    }
    // Verify the refresh token
    const verifiedToken = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
    const jwtPayload = {
        userId: user.id, // Corresponds to TUser.id
        phone: user.phone,
        name: user.name, // Corresponds to TUser.name
        email: user.email, // Corresponds to TUser.email
        role: user.role, // Corresponds to TUser.role
        address: user === null || user === void 0 ? void 0 : user.address, // Optional, corresponds to TUser.address
        img: user === null || user === void 0 ? void 0 : user.img,
    };
    // Generate new access token
    const newAccessToken = userAuth_service_1.UserAuthService.createAccessToken(jwtPayload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Access token refreshed successfully",
        accessToken: newAccessToken,
        data: null, // Include this field as it's required by the TResponse type
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userAuth_service_1.UserAuthService.getAllUsersService();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Users fetched successfully",
        data: users,
    });
}));
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newRole } = req.body;
    const updatedUser = yield userAuth_service_1.UserAuthService.updateUserRoleService(userId, newRole);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User role updated successfully",
        data: updatedUser,
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId; // Extract userId from the authenticated user
    const updatedData = req.body; // Get the updated profile data from the request body
    console.log(req.body);
    const updatedUser = yield userAuth_service_1.UserAuthService.updateUserProfile(userId, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Profile updated successfully",
        data: updatedUser, // Send the updated user data
    });
}));
exports.userAuthControllers = {
    signup,
    login,
    refreshToken,
    getAllUsers,
    updateUserRole,
    updateProfile,
};
