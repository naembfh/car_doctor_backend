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
exports.SlotService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("./slot.model");
const createSlots = (slotData) => __awaiter(void 0, void 0, void 0, function* () {
    const { service: serviceId, date, startTime, endTime } = slotData;
    // Fetch service details to get duration
    const service = yield service_model_1.Service.findById(serviceId);
    if (!service) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service id not valid");
    }
    if (service.isDeleted) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "This service is already deleted");
    }
    // Calculate number of slots based on service duration
    const serviceDuration = service.duration;
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const totalDuration = endMinutes - startMinutes;
    const numberOfSlots = Math.floor(totalDuration / serviceDuration);
    // Generate slots
    const slots = [];
    let currentStartTime = startTime;
    for (let i = 0; i < numberOfSlots; i++) {
        const start = currentStartTime;
        const end = addMinutes(currentStartTime, serviceDuration);
        const slot = new slot_model_1.Slot({
            service: serviceId,
            date,
            startTime: start,
            endTime: end,
            isBooked: "available",
        });
        // Issue here: await inside a loop
        slots.push(yield slot.save());
        currentStartTime = end;
    }
    return slots;
});
// Helper function: Parse time to minutes
function parseTimeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}
// Helper function: Add minutes to time
function addMinutes(time, minutes) {
    const [hours, currentMinutes] = time.split(":").map(Number);
    let newHours = hours;
    let newMinutes = currentMinutes + minutes;
    while (newMinutes >= 60) {
        newHours++;
        newMinutes -= 60;
    }
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}
const getAvailableSlots = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (query.date !== undefined) {
        filter.date = query.date;
    }
    if (query.service !== undefined) {
        filter.service = query.service;
    }
    // Fetch slots asynchronously
    const slots = yield slot_model_1.Slot.find(filter)
        .populate("service", "_id name description price duration isDeleted")
        .exec();
    // if (!slots || slots.length === 0) {
    //   throw new AppError(404, "No available slots found");
    // }
    return slots;
});
exports.SlotService = {
    createSlots,
    getAvailableSlots,
};
