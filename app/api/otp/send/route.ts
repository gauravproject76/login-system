import { NextResponse } from "next/server";
import twilio from "twilio";
import { connectDB } from "../../../lib/mongodb"; // your MongoDB connection
import Otp from "../../../models/otp";          // your Mongoose OTP model

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    await connectDB(); // make sure DB is connected

    const { mobile } = await req.json();

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid mobile number" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in MongoDB
    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });

    // Send WhatsApp message via Twilio
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: `whatsapp:+91${mobile}`,
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error: any) {
    console.error("Twilio/DB ERROR:", error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Server error",
      },
      { status: 500 }
    );
  }
}
