import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SlotQuery } from "./slot.interface";
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

  const query: SlotQuery = {};

  // Helper function to extract string from various types
  const getStringValue = (value: unknown): string | undefined => {
    if (typeof value === "string") {
      return value;
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
    return undefined;
  };

  // Assigning query parameters if they are present
  query.date = getStringValue(date);
  query.service = getStringValue(serviceId);

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
