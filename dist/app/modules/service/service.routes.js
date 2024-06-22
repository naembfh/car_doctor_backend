"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const booking_controller_1 = require("../booking/booking.controller");
const slot_controller_1 = require("../slot/slot.controller");
const service_controller_1 = require("./service.controller");
const router = express_1.default.Router();
// services routes
router.post("/services", (0, auth_1.default)(["admin"]), service_controller_1.ServiceControllers.createService);
router.get("/services/:id", service_controller_1.ServiceControllers.getServiceById);
router.get("/services", service_controller_1.ServiceControllers.getAllServices);
router.put("/services/:id", (0, auth_1.default)(["admin"]), service_controller_1.ServiceControllers.updateService);
router.delete("/services/:id", (0, auth_1.default)(["admin"]), service_controller_1.ServiceControllers.deleteService);
// slots
router.post("/services/slots", (0, auth_1.default)(["admin"]), slot_controller_1.SlotController.createSlots);
router.get("/slots/availability", slot_controller_1.SlotController.getAvailableSlots);
// booking
router.post("/bookings", (0, auth_1.default)(["user"]), booking_controller_1.BookingController.bookService);
router.get("/bookings", (0, auth_1.default)(["admin"]), booking_controller_1.BookingController.getAllBookings);
router.get("/my-bookings", (0, auth_1.default)(["user"]), booking_controller_1.BookingController.getUserBookings);
exports.ServicesRoutes = router;
