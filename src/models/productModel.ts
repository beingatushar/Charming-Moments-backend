import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  id: string; // This will map to _id
  dateAdded?: string;
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
}

const ProductSchema: Schema = new Schema(
  {
    dateAdded: { type: String },
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
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export default mongoose.model<IProduct>("Product", ProductSchema);
