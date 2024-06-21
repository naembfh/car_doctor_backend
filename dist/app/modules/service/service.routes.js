"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const service_controller_1 = require("./service.controller");
const router = express_1.default.Router();
// services routes
router.post("/services", (0, auth_1.default)(["admin"]), service_controller_1.ServiceControllers.createService);
router.get("/services/:id", service_controller_1.ServiceControllers.getServiceById);
router.get("/services", service_controller_1.ServiceControllers.getAllServices);
router.put("/services/:id", service_controller_1.ServiceControllers.updateService);
router.delete("/services/:id", service_controller_1.ServiceControllers.deleteService);
exports.ServicesRoutes = router;
