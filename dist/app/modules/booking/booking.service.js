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
exports.BookingService = void 0;
const stripe_1 = __importDefault(require("stripe"));
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
    console.log(service);
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
            img: service.img,
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
        select: "_id name description img price duration isDeleted",
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
                img: booking.serviceId.img,
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
        isPaid: booking.isPaid,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }));
    return mappedBookings;
});
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
const createCheckoutSession = (bookings, // Ensure this is an array of BookingItem
customerEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: customerEmail,
            line_items: bookings.map((booking) => ({
                // Explicitly type 'booking' here
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: booking.service.name,
                        description: booking.service.description,
                    },
                    unit_amount: booking.service.price * 100, // Amount in cents
                },
                quantity: 1,
            })),
            metadata: {
                bookingIds: bookings
                    .map((booking) => booking._id)
                    .join(","), // Type 'booking' as well here
            },
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/dashboard/current-bookings`,
        });
        return { sessionId: session.id }; // Ensure sessionId is returned
    }
    catch (error) {
        console.error("Stripe session creation error:", error);
        throw new Error("Failed to create checkout session");
    }
});
const handleStripePaymentSuccess = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield stripe.checkout.sessions.retrieve(sessionId);
    const bookingIds = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.bookingIds.split(",");
    // Update booking status or do any necessary post-payment handling
    if (bookingIds) {
        yield booking_model_1.Booking.updateMany({ _id: { $in: bookingIds } }, { isPaid: true });
    }
    return session;
});
exports.BookingService = {
    createBooking,
    getAllBookings,
    getUserBookings,
    createCheckoutSession,
    handleStripePaymentSuccess,
};
