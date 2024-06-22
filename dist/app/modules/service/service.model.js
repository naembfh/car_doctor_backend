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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const slot_model_1 = require("../slot/slot.model");
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
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
serviceSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingService = yield exports.Service.findOne({
            name: this.name,
            _id: { $ne: this._id },
            isDeleted: false,
        });
        if (existingService) {
            const error = new Error("Service with this name already exists.");
            return next(error);
        }
        next();
    });
});
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
