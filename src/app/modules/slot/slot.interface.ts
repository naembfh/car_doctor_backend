import { Types } from "mongoose";

export type TBook = "available" | "booked" | "canceled";
export type Tslot = {
  service: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: TBook;
};
