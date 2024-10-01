import { Types } from "mongoose";
import Stripe from "stripe";
import { Service } from "../service/service.model";
import { Slot } from "../slot/slot.model";
import { UserAuth } from "../userAuth/userAuth.model";
import { TBooking } from "./booking.interface";
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

  const result = bookings.map((booking: any) => ({
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
      select: "_id name description img price duration isDeleted",
    })
    .populate({
      path: "slotId",
      select: "_id service date startTime endTime isBooked",
    })
    .exec();

  const mappedBookings = bookings.map((booking: any) => ({
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
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

interface BookingItem {
  _id: string;
  service: {
    name: string;
    description: string;
    price: number;
  };
}

const createCheckoutSession = async (
  bookings: BookingItem[], 
  customerEmail: string
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: bookings.map((booking: BookingItem) => ({
        // Explicitly type 'booking' here
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service.name,
            description: booking.service.description,
          },
          unit_amount: booking.service.price * 100, 
        },
        quantity: 1,
      })),
      metadata: {
        bookingIds: bookings
          .map((booking: BookingItem) => booking._id)
          .join(","), // Type 'booking' as well here
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/current-bookings`,
    });

    return { sessionId: session.id }; // Ensure sessionId is returned
  } catch (error) {
    console.error("Stripe session creation error:", error);
    throw new Error("Failed to create checkout session");
  }
};

const handleStripePaymentSuccess = async (sessionId: string): Promise<any> => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const bookingIds = session.metadata?.bookingIds.split(",");

  // Update booking status or do any necessary post-payment handling
  if (bookingIds) {
    await Booking.updateMany({ _id: { $in: bookingIds } }, { isPaid: true });
  }

  return session;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getUserBookings,
  createCheckoutSession,
  handleStripePaymentSuccess,
};
