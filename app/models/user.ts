import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
      length: 10,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
