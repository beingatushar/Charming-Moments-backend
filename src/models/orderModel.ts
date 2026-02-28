import { randomUUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: string; // Refers to Product ID
  name: string;
  quantity: number;
  price: number; // Storing price at the time of purchase
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  id: string;
  user: string; // Refers to User ID
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: string;
  paymentStatus: "Pending" | "Completed" | "Failed";
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, unique: true, default: () => randomUUID() },
    user: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    shippingAddress: { type: AddressSchema, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
