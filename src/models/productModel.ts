import mongoose, { Document, Schema } from "mongoose";
import { randomUUID } from "crypto";

export interface IProduct extends Document {
  id: string;
  dateAdded?: Date;
  category: string;
  name: string;
  description?: string;
  size?: string;
  price: number;
  features?: string[];
  image?: string;
  stock?: number;
  rating?: number;
  tags?: string[];
  material?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    id: { 
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID()
    },
    dateAdded: { type: Date, default: Date.now },
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    features: { type: [String] },
    image: { type: String },
    stock: { type: Number },
    rating: { type: Number },
    tags: { type: [String] },
    material: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // No need to transform _id to id since we have explicit id field
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        // No need to transform _id to id since we have explicit id field
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Add index for better query performance
ProductSchema.index({ id: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isDeleted: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);