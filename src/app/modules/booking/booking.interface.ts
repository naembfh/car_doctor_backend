import { Types } from "mongoose";
import { TService } from "../service/service.interface";

import { Tslot } from "../slot/slot.interface";
import { TUserAuth } from "../userAuth/userAuth.interface";

export interface TBooking {
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
}

export interface MappedBooking {
  _id: Types.ObjectId;
  customer: Partial<TUserAuth>;
  service: Partial<TService>;
  slot: Partial<Tslot>;
}
