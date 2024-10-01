"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("./service.model");
const createService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield service_model_1.Service.create(payload);
    return result;
});
const getServiceById = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(serviceId);
    const service = yield service_model_1.Service.findOne({ id: serviceId });
    if (!service) {
        throw new Error(`Service with id ${serviceId} not found`);
    }
    if (service.isDeleted) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "This service is already deleted");
    }
    return service;
});
const getAllServices = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.Service.find({ isDeleted: false });
    return result;
});
const updateService = (serviceId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(serviceId);
    if (!service) {
        throw new Error(`Service with id ${serviceId} not found`);
    }
    if (service.isDeleted) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "This service is already deleted");
    }
    const result = service_model_1.Service.findByIdAndUpdate(serviceId, payload, { new: true });
    return result;
});
const deleteService = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(serviceId);
    if (!service) {
        throw new Error(`Service with id ${serviceId} not found`);
    }
    if (service.isDeleted) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "This service is already deleted");
    }
    const result = service_model_1.Service.findByIdAndUpdate(serviceId, { isDeleted: true }, { new: true });
    return result;
});
exports.ServiceServices = {
    createService,
    getServiceById,
    getAllServices,
    updateService,
    deleteService,
};
