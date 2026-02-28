import { randomUUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

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
  addresses?: IAddress[];
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
    addresses: {
      type: [
        {
          street: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          postalCode: { type: String, required: true },
          country: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
);

UserSchema.index({ email: 1 });
UserSchema.index({ id: 1 }, { unique: true });

export default mongoose.model<IUser>("User", UserSchema);
