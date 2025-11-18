import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  content: string; // 🔹 FIX: Changed from 'text' to 'content'
  isActive: boolean;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
      default:
        "Welcome to Shelly Nutrition!|||Free Shipping on orders over ₹999",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IBanner>("Banner", BannerSchema);
