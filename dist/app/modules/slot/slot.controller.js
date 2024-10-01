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
exports.SlotController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const slot_service_1 = require("./slot.service");
// Create slots for a service
const createSlots = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slots = yield slot_service_1.SlotService.createSlots(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Slots created successfully",
        data: slots,
    });
}));
const getAvailableSlots = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, serviceId } = req.query;
    const query = {};
    // Helper function to extract string from various types
    const getStringValue = (value) => {
        if (typeof value === "string") {
            return value;
        }
        else if (Array.isArray(value) && typeof value[0] === "string") {
            return value[0];
        }
        return undefined;
    };
    // Assigning query parameters if they are present
    query.date = getStringValue(date);
    query.service = getStringValue(serviceId);
    // Fetch slots asynchronously
    const slots = yield slot_service_1.SlotService.getAvailableSlots(query);
    // Respond with fetched slots
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Available slots retrieved successfully",
        data: slots,
    });
}));
// Update slot booking status
const updateSlot = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slotId, isBooked } = req.body;
    console.log(req.body);
    const updatedSlot = yield slot_service_1.SlotService.updateSlot(slotId, isBooked);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Slot updated successfully",
        data: updatedSlot,
    });
}));
exports.SlotController = {
    createSlots,
    getAvailableSlots,
    updateSlot,
};
