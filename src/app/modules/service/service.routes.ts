import express from "express";
import auth from "../../middlewares/auth";
import { ServiceControllers } from "./service.controller";

const router = express.Router();

// services routes
router.post("/services", auth(["admin"]), ServiceControllers.createService);
router.get("/services/:id", ServiceControllers.getServiceById);
router.get("/services", ServiceControllers.getAllServices);
router.put("/services/:id", ServiceControllers.updateService);
router.delete("/services/:id", ServiceControllers.deleteService);

export const ServicesRoutes = router;
