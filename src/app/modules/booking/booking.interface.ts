import { Types } from "mongoose";
import { TService } from "../service/service.interface";
import { Tslot } from "../slot/slot.interface";
import { TUserAuth } from "../userAuth/userAuth.interface";

export type TBooking = {
  customer: Types.ObjectId | TUserAuth;
  serviceId: Types.ObjectId | TService;
  slotId: Types.ObjectId | Tslot;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: number;
  registrationPlate: string;
  createdAt?: Date;
  updatedAt?: Date;
};
