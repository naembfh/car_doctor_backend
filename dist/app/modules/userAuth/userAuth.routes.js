"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const userAuth_controller_1 = require("./userAuth.controller");
const router = express_1.default.Router();
router.post("/signup", userAuth_controller_1.userAuthControllers.signup);
router.post("/login", userAuth_controller_1.userAuthControllers.login);
router.post("/refresh-token", userAuth_controller_1.userAuthControllers.refreshToken); // Add refresh token route
router.get("/all-users", (0, auth_1.default)(["admin"]), userAuth_controller_1.userAuthControllers.getAllUsers);
router.patch("/update-role", (0, auth_1.default)(["admin"]), userAuth_controller_1.userAuthControllers.updateUserRole);
router.patch("/update-profile", (0, auth_1.default)(["user", "admin"]), userAuth_controller_1.userAuthControllers.updateProfile);
exports.UserAuthRoutes = router;
