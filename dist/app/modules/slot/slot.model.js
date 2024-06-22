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
exports.Slot = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const slotSchema = new mongoose_1.Schema({
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: {
        type: String,
        enum: ["available", "booked", "canceled"],
        default: "available",
    },
}, {
    timestamps: true,
});
slotSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const slot = this;
        if (slot.isNew) {
            const overlappingSlot = yield slot.constructor.findOne({
                service: slot.service,
                date: slot.date,
                $or: [
                    { startTime: { $lt: slot.endTime }, endTime: { $gt: slot.startTime } },
                    { startTime: { $gte: slot.startTime, $lt: slot.endTime } },
                    { endTime: { $gt: slot.startTime, $lte: slot.endTime } },
                ],
            });
            if (overlappingSlot) {
                throw new AppError_1.default(http_status_1.default.CONFLICT, `A slot already exists for the specified time range on ${overlappingSlot.date} from ${overlappingSlot.startTime} to ${overlappingSlot.endTime}`);
            }
        }
        next();
    });
});
exports.Slot = (0, mongoose_1.model)("Slot", slotSchema);
