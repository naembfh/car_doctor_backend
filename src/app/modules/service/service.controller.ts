import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ServiceServices } from "./service.service";

const createService = catchAsync(async (req, res) => {
  const service = await ServiceServices.createService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service created successfully",
    data: service,
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const service = await ServiceServices.getServiceById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service retrieved successfully",
    data: service,
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const services = await ServiceServices.getAllServices();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: services,
  });
});

const updateService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedService = await ServiceServices.updateService(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: updatedService,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedService = await ServiceServices.deleteService(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service deleted successfully",
    data: deletedService,
  });
});

export const ServiceControllers = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
