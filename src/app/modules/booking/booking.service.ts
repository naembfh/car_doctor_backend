import { Types } from "mongoose";
import { Service } from "../service/service.model";
import { Slot } from "../slot/slot.model";
import { UserAuth } from "../userAuth/userAuth.model";
import { MappedBooking, TBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (
  userId: Types.ObjectId,
  bookingData: Partial<TBooking>
) => {
  const {
    serviceId,
    slotId,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    manufacturingYear,
    registrationPlate,
  } = bookingData;

  if (!slotId) throw new Error("slotId is required");
  if (!serviceId) throw new Error("serviceId is required");

  const customer = await UserAuth.findById(userId);
  if (!customer) throw new Error("Customer not found");

  const service = await Service.findById(serviceId);
  if (!service) throw new Error("Service not found");

  const slot = await Slot.findById(slotId);
  if (!slot) throw new Error("Slot not found");

  if (slot.isBooked === "booked") throw new Error("Slot already booked");

  slot.isBooked = "booked";
  await slot.save();

  const newBooking = await Booking.create({
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
};

const getAllBookings = async () => {
  const bookings = await Booking.find()
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

  const result = bookings.map((booking: MappedBooking) => ({
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
};

const getUserBookings = async (userId: Types.ObjectId) => {
  const bookings = await Booking.find({ customer: userId })
    .populate({
      path: "serviceId",
      select: "_id name description price duration isDeleted",
    })
    .populate({
      path: "slotId",
      select: "_id service date startTime endTime isBooked",
    })
    .exec();

  const mappedBookings = bookings.map((booking: MappedBooking) => ({
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
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getUserBookings,
};
