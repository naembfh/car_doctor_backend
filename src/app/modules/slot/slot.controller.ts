import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SlotService } from "./slot.service";

// Create slots for a service
const createSlots = catchAsync(async (req, res) => {
  const slots = await SlotService.createSlots(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slots created successfully",
    data: slots,
  });
});

const getAvailableSlots = catchAsync(async (req, res) => {
  const { date, serviceId } = req.query;
  const query: any = {};

  if (date) {
    query.date = date;
  }

  if (serviceId) {
    query.service = serviceId;
  }

  // Fetch slots asynchronously
  const slots = await SlotService.getAvailableSlots(query);

  // Respond with fetched slots
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Available slots retrieved successfully",
    data: slots,
  });
});

export const SlotController = {
  createSlots,
  getAvailableSlots,
};
