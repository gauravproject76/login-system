import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Otp from "../../../models/otp";
import User from "../../../models/user"

export async function POST(req: Request) {
  const { mobile, otp } = await req.json();

  await connectDB();

  const record = await Otp.findOne({ mobile });

  if (!record) {
    return NextResponse.json({ success: false, message: "OTP not found" });
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return NextResponse.json({ success: false, message: "Invalid OTP" });
  }

  const user = await User.findOne({mobile});

  if (!user) {
    await User.insertOne({mobile, isVerified:true})
  }

  await Otp.deleteOne({ mobile });

  return NextResponse.json({ success: true });
}
