import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

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

const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await BookingService.getAllBookings();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All bookings retrieved successfully",
    data: bookings,
  });
});

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

export const BookingController = {
  bookService,
  getAllBookings,
  getUserBookings,
};
