import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TService } from "./service.interface";
import { Service } from "./service.model";

const createService = async (payload: TService) => {

  const result = await Service.create(payload);

  return result;
};

const getServiceById = async (serviceId: string) => {

  const service = await Service.findOne({ id: serviceId });

  if (!service) {
    throw new Error(`Service with id ${serviceId} not found`);
  }

  if (service.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This service is already deleted"
    );
  }

  return service;
};

const getAllServices = async () => {
  const result = await Service.find({ isDeleted: false });

  return result;
};

const updateService = async (serviceId: string, payload: Partial<TService>) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error(`Service with id ${serviceId} not found`);
  }

  if (service.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This service is already deleted"
    );
  }

  const result = Service.findByIdAndUpdate(serviceId, payload, { new: true });

  return result;
};

const deleteService = async (serviceId: string) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error(`Service with id ${serviceId} not found`);
  }

  if (service.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This service is already deleted"
    );
  }
  const result = Service.findByIdAndUpdate(
    serviceId,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

export const ServiceServices = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
