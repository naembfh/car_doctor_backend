import express from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "../booking/booking.controller";
import { SlotController } from "../slot/slot.controller";
import { ServiceControllers } from "./service.controller";

const router = express.Router();

// services routes
router.post("/services", auth(["admin"]), ServiceControllers.createService);
router.get("/services/:id", ServiceControllers.getServiceById);
router.get("/services", ServiceControllers.getAllServices);
router.put("/services/:id", auth(["admin"]), ServiceControllers.updateService);
router.delete(
  "/services/:id",
  auth(["admin"]),
  ServiceControllers.deleteService
);

// slots
router.post("/services/slots", auth(["admin"]), SlotController.createSlots);
router.get("/slots/availability", SlotController.getAvailableSlots);
router.patch("/slots/update", SlotController.updateSlot);

// booking
router.post(
  "/bookings",
  auth(["admin", "user"]),
  BookingController.bookService
);
router.get("/bookings", auth(["admin"]), BookingController.getAllBookings);
router.get(
  "/my-bookings",
  auth(["user", "admin"]),
  BookingController.getUserBookings
);

router.post(
  "/create-checkout-session",
  BookingController.createCheckoutSession
);

router.get("/success", BookingController.handleSuccessPayment);

export const ServicesRoutes = router;
