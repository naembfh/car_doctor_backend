import express from "express";
import { userAuthControllers } from "./userAuth.controller";

const router = express.Router();

router.post("/signup", userAuthControllers.signup);
router.post("/login", userAuthControllers.login);

export const UserAuthRoutes = router;
