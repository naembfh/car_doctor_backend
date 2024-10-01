import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

// Handle booking creation
const bookService = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bookingData = req.body;

  const newBooking = await BookingService.createBooking(
    user.userId,
    bookingData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking successful",
    data: newBooking,
  });
});

// Handle fetching all bookings (Admin)
const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await BookingService.getAllBookings();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All bookings retrieved successfully",
    data: bookings,
  });
});

// Handle fetching user's own bookings
const getUserBookings = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bookings = await BookingService.getUserBookings(user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User bookings retrieved successfully",
    data: bookings,
  });
});

// Handle creating a checkout session for Stripe
const createCheckoutSession = catchAsync(async (req, res) => {
  const { bookings, customerEmail } = req.body;

  try {
    const session = await BookingService.createCheckoutSession(
      bookings,
      customerEmail
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stripe checkout session created successfully",
      data: { session },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create Stripe session",
    });
  }
});

// Handle Stripe payment success
const handleSuccessPayment = catchAsync(async (req, res) => {
  const session_id = req.query.session_id as string;

  try {
    const session = await BookingService.handleStripePaymentSuccess(session_id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed and bookings updated successfully",
      data: session,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message:
        error instanceof Error ? error.message : "Failed to confirm payment",

      data: null,
    });
  }
});

export const BookingController = {
  bookService,
  getAllBookings,
  getUserBookings,
  createCheckoutSession,
  handleSuccessPayment,
};
