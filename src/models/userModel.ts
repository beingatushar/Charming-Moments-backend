import { randomUUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional because we might not select it by default
  role: "user" | "admin";
  mobile?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      default: () => randomUUID(),
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false }, // Don't return password by default
    role: { type: String, enum: ["user", "admin"], default: "user" },
    mobile: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Ensure password is never returned in JSON
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  },
);

UserSchema.index({ email: 1 });
UserSchema.index({ id: 1 }, { unique: true });

export default mongoose.model<IUser>("User", UserSchema);
