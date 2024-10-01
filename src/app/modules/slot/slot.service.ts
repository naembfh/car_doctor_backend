import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Service } from "../service/service.model";
import { SlotQuery, TBook, Tslot } from "./slot.interface";
import { Slot } from "./slot.model";

const createSlots = async (slotData: Tslot) => {
  const { service: serviceId, date, startTime, endTime } = slotData;

  // Fetch service details to get duration
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service id not valid");
  }

  if (service.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This service is already deleted"
    );
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
    const slot = new Slot({
      service: serviceId,
      date,
      startTime: start,
      endTime: end,
      isBooked: "available",
    });
    // Issue here: await inside a loop
    slots.push(await slot.save());
    currentStartTime = end;
  }
  return slots;
};

// Helper function: Parse time to minutes
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper function: Add minutes to time
function addMinutes(time: string, minutes: number): string {
  const [hours, currentMinutes] = time.split(":").map(Number);
  let newHours = hours;
  let newMinutes = currentMinutes + minutes;

  while (newMinutes >= 60) {
    newHours++;
    newMinutes -= 60;
  }

  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

const getAvailableSlots = async (query: SlotQuery) => {
  const filter: Partial<SlotQuery> = {};

  if (query.date !== undefined) {
    filter.date = query.date;
  }

  if (query.service !== undefined) {
    filter.service = query.service;
  }

  // Fetch slots asynchronously
  const slots = await Slot.find(filter)
    .populate("service", "_id name description price duration isDeleted")
    .exec();

  // if (!slots || slots.length === 0) {
  //   throw new AppError(404, "No available slots found");
  // }

  return slots;
};

// Update slot booking status
const updateSlot = async (slotId: string, isBooked: TBook) => {
  const slot = await Slot.findById(slotId);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
  }

  // Validate isBooked
  const validStatuses: TBook[] = ["available", "booked", "canceled"];
  if (!validStatuses.includes(isBooked)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid isBooked status: ${isBooked}`);
  }

  // Assign the validated value
  slot.isBooked = isBooked;
  await slot.save();

  return slot;
};

export const SlotService = {
  createSlots,
  getAvailableSlots,
  updateSlot,
};
