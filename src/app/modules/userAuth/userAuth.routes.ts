import express from "express";
import auth from "../../middlewares/auth";
import { userAuthControllers } from "./userAuth.controller";

const router = express.Router();

router.post("/signup", userAuthControllers.signup);
router.post("/login", userAuthControllers.login);
router.post("/refresh-token", userAuthControllers.refreshToken); // Add refresh token route
router.get("/all-users", auth(["admin"]), userAuthControllers.getAllUsers);
router.patch(
  "/update-role",
  auth(["admin"]),
  userAuthControllers.updateUserRole
);

router.patch(
  "/update-profile",
  auth(["user", "admin"]),
  userAuthControllers.updateProfile
);

export const UserAuthRoutes = router;
