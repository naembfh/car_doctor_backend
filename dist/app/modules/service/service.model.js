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
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify")); // Use slugify package to create slugs
const slot_model_1 = require("../slot/slot.model");
// Define the Service schema
const serviceSchema = new mongoose_1.Schema({
    id: { type: String, unique: true }, // String ID, unique
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }, // Automatically generated from name + id
    description: { type: String, required: true },
    img: { type: String }, // Optional field
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        transform(doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
// Pre-save hook to handle dynamic id and slug creation
serviceSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = this;
        // If it's a new service (not an update), generate a string ID and slug
        if (service.isNew) {
            // Generate a unique string ID (can be UUID or based on some logic)
            service.id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
            console.log(service.id);
        }
        // Create a slug from the service name combined with the string id
        service.slug = (0, slugify_1.default)(`${service.name}-${service.id}`, {
            lower: true,
            strict: true,
        });
        console.log(service.slug);
        // Ensure the service name is unique
        const existingService = yield exports.Service.findOne({
            name: service.name,
            _id: { $ne: service._id },
            isDeleted: false,
        });
        if (existingService) {
            const error = new Error("Service with this name already exists.");
            return next(error);
        }
        next();
    });
});
// Pre-update hook to check if the service is being deleted, and delete associated slots
serviceSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if ((update === null || update === void 0 ? void 0 : update.isDeleted) === true) {
            try {
                const service = yield this.model.findOne(this.getQuery());
                if (service) {
                    yield slot_model_1.Slot.deleteMany({ service: service._id });
                }
                next();
            }
            catch (err) {
                next(err);
            }
        }
        else {
            next();
        }
    });
});
// Pre-delete hook to delete associated slots when a service is deleted
serviceSchema.pre("deleteOne", { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield slot_model_1.Slot.deleteMany({ service: this._id });
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
// Create the model
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
