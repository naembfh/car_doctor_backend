import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import config from "../../config";
import { UserAuthDocument, UserAuthModel } from "./userAuth.interface";

const UserAuthSchema = new Schema<UserAuthDocument, UserAuthModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    address: { type: String },
    img: { type: String },
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Middleware to ensure email uniqueness and hash password before saving
UserAuthSchema.pre("save", async function (next) {
  const user = this as UserAuthDocument;
  if (this.isModified("email")) {
    const existingUser = await mongoose.models.User.findOne({
      email: user.email,
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }
  }
  next();
});

UserAuthSchema.pre("save", async function (next) {
  const user = this as UserAuthDocument;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// Static methods
UserAuthSchema.statics.IsUserExistsByEmail = async function (
  email: string
): Promise<UserAuthDocument | null> {
  return this.findOne({ email }).select("+password").exec();
};

UserAuthSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export const UserAuth = model<UserAuthDocument, UserAuthModel>(
  "User",
  UserAuthSchema
);
