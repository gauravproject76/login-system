import mongoose, { Schema, models } from "mongoose";

const OtpSchema = new Schema(
  {
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 300 }, // ⏱ auto-delete after 5 minutes
    },
  },
  { timestamps: true }
);

export default models.Otp || mongoose.model("Otp", OtpSchema);
