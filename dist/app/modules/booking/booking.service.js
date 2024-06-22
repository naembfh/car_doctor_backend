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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("../slot/slot.model");
const userAuth_model_1 = require("../userAuth/userAuth.model");
const booking_model_1 = require("./booking.model");
const createBooking = (userId, bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId, slotId, vehicleType, vehicleBrand, vehicleModel, manufacturingYear, registrationPlate, } = bookingData;
    if (!slotId)
        throw new Error("slotId is required");
    if (!serviceId)
        throw new Error("serviceId is required");
    const customer = yield userAuth_model_1.UserAuth.findById(userId);
    if (!customer)
        throw new Error("Customer not found");
    const service = yield service_model_1.Service.findById(serviceId);
    if (!service)
        throw new Error("Service not found");
    const slot = yield slot_model_1.Slot.findById(slotId);
    if (!slot)
        throw new Error("Slot not found");
    if (slot.isBooked === "booked")
        throw new Error("Slot already booked");
    slot.isBooked = "booked";
    yield slot.save();
    const newBooking = yield booking_model_1.Booking.create({
        customer: customer._id,
        serviceId: service._id,
        slotId: slot._id,
        vehicleType,
        vehicleBrand,
        vehicleModel,
        manufacturingYear,
        registrationPlate,
    });
    const bookingResponse = {
        _id: newBooking._id,
        customer: {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
        },
        service: {
            _id: service._id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            isDeleted: service.isDeleted,
        },
        slot: {
            _id: slot._id,
            service: slot.service,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
        },
        vehicleType,
        vehicleBrand,
        vehicleModel,
        manufacturingYear,
        registrationPlate,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt,
    };
    return bookingResponse;
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield booking_model_1.Booking.find()
        .populate({
        path: "customer",
        select: "_id name email phone address",
    })
        .populate({
        path: "serviceId",
        select: "_id name description price duration isDeleted",
    })
        .populate({
        path: "slotId",
        select: "_id service date startTime endTime isBooked",
    })
        .exec();
    const result = bookings.map((booking) => ({
        _id: booking._id,
        customer: booking.customer
            ? {
                _id: booking.customer._id,
                name: booking.customer.name,
                email: booking.customer.email,
                phone: booking.customer.phone,
                address: booking.customer.address,
            }
            : {},
        service: booking.serviceId
            ? {
                _id: booking.serviceId._id,
                name: booking.serviceId.name,
                description: booking.serviceId.description,
                price: booking.serviceId.price,
                duration: booking.serviceId.duration,
                isDeleted: booking.serviceId.isDeleted,
            }
            : {},
        slot: booking.slotId
            ? {
                _id: booking.slotId._id,
                service: booking.slotId.service,
                date: booking.slotId.date,
                startTime: booking.slotId.startTime,
                endTime: booking.slotId.endTime,
                isBooked: booking.slotId.isBooked,
            }
            : {},
    }));
    return result;
});
const getUserBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield booking_model_1.Booking.find({ customer: userId })
        .populate({
        path: "serviceId",
        select: "_id name description price duration isDeleted",
    })
        .populate({
        path: "slotId",
        select: "_id service date startTime endTime isBooked",
    })
        .exec();
    const mappedBookings = bookings.map((booking) => ({
        _id: booking._id,
        service: booking.serviceId
            ? {
                _id: booking.serviceId._id,
                name: booking.serviceId.name,
                description: booking.serviceId.description,
                price: booking.serviceId.price,
                duration: booking.serviceId.duration,
                isDeleted: booking.serviceId.isDeleted,
            }
            : null,
        slot: booking.slotId
            ? {
                _id: booking.slotId._id,
                service: booking.slotId.service,
                date: booking.slotId.date,
                startTime: booking.slotId.startTime,
                endTime: booking.slotId.endTime,
                isBooked: booking.slotId.isBooked,
            }
            : null,
        vehicleType: booking.vehicleType,
        vehicleBrand: booking.vehicleBrand,
        vehicleModel: booking.vehicleModel,
        manufacturingYear: booking.manufacturingYear,
        registrationPlate: booking.registrationPlate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }));
    return mappedBookings;
});
exports.BookingService = {
    createBooking,
    getAllBookings,
    getUserBookings,
};
