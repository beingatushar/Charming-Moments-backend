import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  text: string;
  isActive: boolean;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
      default: "Welcome to Shelly Nutrition!",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// We only need one banner document, so no complex indexing needed
export default mongoose.model<IBanner>("Banner", BannerSchema);
